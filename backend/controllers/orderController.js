const db = require("../config/db");






// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
  let connection;
  

  const userId = req.user.id;
  try {
    connection = await db.getConnection();

    const {
      customer_name,
      customer_email,
      phone,
      address,
      city,
      state,
      pincode,
      total_amount,
      payment_method,
      items,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !customer_name ||
      !customer_email ||
      !address ||
      total_amount === undefined ||
      total_amount === null ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer details, address and order items are required.",
      });
    }

    // =================================================
    // VALIDATE ITEMS
    // =================================================

    for (const item of items) {
      const productId =
        item.product_id || item.id;

      const quantity = Number(
        item.quantity || 1
      );

      const price = Number(
        item.price || 0
      );

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required.",
        });
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product quantity must be greater than 0.",
        });
      }

      if (price < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Product price cannot be negative.",
        });
      }
    }

    // =================================================
    // START TRANSACTION
    // =================================================

    await connection.beginTransaction();

    // =================================================
    // CHECK STOCK
    // =================================================

    for (const item of items) {
      const productId =
        item.product_id || item.id;

      const quantity = Number(
        item.quantity || 1
      );

      const [products] =
        await connection.query(
          `
          SELECT
            id,
            name,
            price,
            stock
          FROM products
          WHERE id = ?
          FOR UPDATE
          `,
          [productId]
        );

      if (products.length === 0) {
        throw new Error(
          `Product with ID ${productId} was not found.`
        );
      }

      const product = products[0];

      const availableStock = Number(
        product.stock || 0
      );

      if (availableStock < quantity) {
        throw new Error(
          `Not enough stock for "${product.name}". Available stock: ${availableStock}, requested: ${quantity}.`
        );
      }
    }

    // =================================================
// CREATE CUSTOMER ORDER NUMBER
// =================================================

// Lock the current customer row so two orders
// cannot receive the same customer order number.
await connection.query(
  `
  SELECT id
  FROM users
  WHERE id = ?
  FOR UPDATE
  `,
  [userId]
);

const [orderNumberResult] =
  await connection.query(
    `
    SELECT
      COALESCE(
        MAX(customer_order_number),
        0
      ) + 1 AS customerOrderNumber
    FROM orders
    WHERE user_id = ?
    `,
    [userId]
  );

const customerOrderNumber =
  orderNumberResult[0].customerOrderNumber;

    // =================================================
    // CREATE ORDER
    // =================================================

    const [orderResult] =
      await connection.query(
        `
        INSERT INTO orders
        (
          user_id,
          customer_order_number,
          customer_name,
          customer_email,
          phone,
          address,
          city,
          state,
          pincode,
          total_amount,
          payment_method,
          payment_status,
          order_status
        )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          customerOrderNumber,
          customer_name,
          customer_email,
          phone || null,
          address,
          city || null,
          state || null,
          pincode || null,
          Number(total_amount),
          payment_method ||
            "Cash on Delivery",
          "Pending",
          "Placed",
        ]
      );

    const orderId =
      orderResult.insertId;

    // =================================================
    // CREATE ORDER ITEMS + REDUCE STOCK
    // =================================================

    for (const item of items) {
      const productId =
        item.product_id || item.id;

      const productName =
        item.product_name || item.name;

      const quantity = Number(
        item.quantity || 1
      );

      const price = Number(
        item.price || 0
      );

      if (!productId || !productName) {
        throw new Error(
          "Invalid product information in order."
        );
      }

      await connection.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          quantity,
          price
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          orderId,
          productId,
          productName,
          quantity,
          price,
        ]
      );

      const [stockResult] =
        await connection.query(
          `
          UPDATE products
          SET stock = stock - ?
          WHERE id = ?
            AND stock >= ?
          `,
          [
            quantity,
            productId,
            quantity,
          ]
        );

      if (
        stockResult.affectedRows === 0
      ) {
        throw new Error(
          `Unable to update stock for product "${productName}".`
        );
      }
    }

    // =================================================
    // COMMIT
    // =================================================

    await connection.commit();

    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully.",
      orderId,
    });

  } catch (error) {

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError
        );
      }
    }

    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to place order.",
    });

  } finally {

    if (connection) {
      connection.release();
    }
  }
};

// =====================================================
// GET ORDERS
// =====================================================

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let orders;

    // ================================================
    // ADMIN CAN SEE ALL ORDERS
    // ================================================

    if (userRole === "admin") {
      [orders] = await db.query(
        `
        SELECT *
        FROM orders
        ORDER BY created_at DESC
        `
      );
    }
      // ================================================
    // CUSTOMER CAN SEE ONLY THEIR OWN ORDERS
    // ================================================

    else if (userRole === "customer") {
      [orders] = await db.query(
        `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
      );
    }
    // ================================================
// SELLER CAN VIEW ORDER FOR THEIR PRODUCTS ONLY
// ================================================

else if (userRole === "seller") {
  [orders] = await db.query(
    `
    SELECT
      o.id,
      o.customer_order_number,
      o.customer_name,
      o.customer_email,
      o.phone,
      o.address,
      o.city,
      o.state,
      o.pincode,
      o.payment_method,
      o.payment_status,
      o.order_status,
      o.created_at,

      SUM(oi.quantity * oi.price) AS seller_total

    FROM orders o

    INNER JOIN order_items oi
      ON o.id = oi.order_id

    INNER JOIN products p
      ON oi.product_id = p.id

    WHERE p.seller_id = ?

    GROUP BY
      o.id,
      o.customer_order_number,
      o.customer_name,
      o.customer_email,
      o.phone,
      o.address,
      o.city,
      o.state,
      o.pincode,
      o.payment_method,
      o.payment_status,
      o.order_status,
      o.created_at

    ORDER BY o.created_at DESC
    `,
    [userId]
  );
}




    // ================================================
    // OTHER USERS
    // ================================================

    else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view orders.",
      });
    }

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load orders.",
      error: error.message,
    });
  }
};
// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;
    const userRole = req.user.role;

    let orders;

    // ================================================
    // ADMIN CAN VIEW ANY ORDER
    // ================================================

    if (userRole === "admin") {
      [orders] = await db.query(
        `
        SELECT *
        FROM orders
        WHERE id = ?
        `,
        [id]
      );
    }

    // ================================================
    // CUSTOMER CAN VIEW ONLY THEIR OWN ORDER
    // ================================================

    else if (userRole === "customer") {
      [orders] = await db.query(
        `
        SELECT *
        FROM orders
        WHERE id = ?
        AND user_id = ?
        `,
        [id, userId]
      );
    }

    // ================================================
// SELLER CAN VIEW AN ORDER ONLY IF IT CONTAINS
// THE SELLER'S PRODUCT
// ================================================

else if (userRole === "seller") {
  [orders] = await db.query(
    `
    SELECT DISTINCT o.*
    FROM orders o
    INNER JOIN order_items oi
      ON o.id = oi.order_id
    INNER JOIN products p
      ON oi.product_id = p.id
    WHERE o.id = ?
    AND p.seller_id = ?
    `,
    [id, userId]
  );
}


    else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order.",
      });
    }

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const [items] = await db.query(
      `
      SELECT *
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
      `,
      [id]
    );

   return res.json({
  success: true,
  order: {
    ...orders[0],
    items,
  },
});

  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load order.",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const {
      order_status,
    } = req.body;

    if (!order_status) {
      return res.status(400).json({
        success: false,
        message:
          "Order status is required.",
      });
    }

    const allowedStatuses = [
      "Placed",
      "Pending",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        order_status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status.",
      });
    }

    const [result] =
      await db.query(
        `
        UPDATE orders
        SET order_status = ?
        WHERE id = ?
        `,
        [
          order_status,
          id,
        ]
      );

    if (
      result.affectedRows === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Order status updated successfully.",
    });

  } catch (error) {

    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status.",
      error: error.message,
    });
  }
};


// =====================================================
// CANCEL ORDER
// =====================================================

const cancelOrder = async (
  req,
  res
) => {
  let connection;

  try {

    const { id } = req.params;

    connection =
      await db.getConnection();

    await connection.beginTransaction();

    // =================================================
    // GET ORDER
    // =================================================

    const [orders] =
      await connection.query(
        `
        SELECT
  id,
  user_id,
  order_status
FROM orders
WHERE id = ?
AND user_id = ?
FOR UPDATE
        `,
        [id, req.user.id]
      );

    if (orders.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    const order = orders[0];

    // =================================================
    // ALREADY CANCELLED
    // =================================================

    if (
      order.order_status ===
      "Cancelled"
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message:
          "Order is already cancelled.",
      });
    }

    // =================================================
    // CHECK CANCELLATION
    // =================================================

    const cancellableStatuses = [
      "Placed",
      "Pending",
      "Processing",
    ];

    if (
      !cancellableStatuses.includes(
        order.order_status
      )
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message:
          "This order can no longer be cancelled.",
      });
    }

    // =================================================
    // GET ORDER ITEMS
    // =================================================

    const [items] =
      await connection.query(
        `
        SELECT
          product_id,
          quantity
        FROM order_items
        WHERE order_id = ?
        `,
        [id]
      );

    // =================================================
    // RESTORE STOCK
    // =================================================

    for (const item of items) {

      if (!item.product_id) {
        continue;
      }

      await connection.query(
        `
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
        `,
        [
          Number(
            item.quantity || 0
          ),
          item.product_id,
        ]
      );
    }

    // =================================================
    // CANCEL ORDER
    // =================================================

    const [result] =
      await connection.query(
        `
        UPDATE orders
        SET order_status = ?
        WHERE id = ?
        `,
        [
          "Cancelled",
          id,
        ]
      );

    if (
      result.affectedRows === 0
    ) {
      throw new Error(
        "Unable to cancel order."
      );
    }

    // =================================================
    // COMMIT
    // =================================================

    await connection.commit();

    return res.json({
      success: true,
      message:
        "Order cancelled successfully.",
      orderId: id,
    });

  } catch (error) {

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError
        );
      }
    }

    console.error(
      "Cancel order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to cancel order.",
    });

  } finally {

    if (connection) {
      connection.release();
    }
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};