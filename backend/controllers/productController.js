const db = require("../config/db");

// =========================================
// ADD PRODUCT
// =========================================

const addProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    const {
      name,
      category,
      price,
      oldPrice,
      description,
      image,
      stock,
      rating,
    } = req.body;

    // =======================================
    // VALIDATION
    // =======================================

    if (
      !name ||
      price === undefined ||
      stock === undefined ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product name, price, stock and image are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative.",
      });
    }

    // =======================================
    // INSERT PRODUCT
    // =======================================

  const sql = `
  INSERT INTO products
  (
    name,
    category,
    price,
    old_price,
    description,
    image,
    stock,
    seller_id,
    rating,
    reviews,
    status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
`;

    const values = [
      name.trim(),

      category || "Electronics",

      Number(price),

      oldPrice === "" ||
      oldPrice === undefined ||
      oldPrice === null
        ? null
        : Number(oldPrice),

      description
        ? description.trim()
        : "",

      image.trim(),

Number(stock),

sellerId,

rating === "" ||
rating === undefined ||
rating === null
  ? 4.5
  : Number(rating),

0,
    ];

    const [result] =
      await db.query(
        sql,
        values
      );

    // =======================================
    // RESPONSE
    // =======================================

    return res.status(201).json({
      success: true,
      message:
        "Product added successfully.",
      productId:
        result.insertId,
    });
  } catch (error) {
    console.error(
      "Add product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to add product.",
      error: error.message,
    });
  }
};


// =========================================
// GET ALL PRODUCTS
// =========================================

const getProducts = async (
  req,
  res
) => {
  try {
    const [products] =
      await db.query(`
        SELECT
          id,
          name,
          category,
          price,
          old_price AS oldPrice,
          description,
          image,
          stock,
          rating,
          reviews,
          created_at AS createdAt
        FROM products
WHERE status = 'Approved'
ORDER BY id DESC
      `);

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get products.",
      error: error.message,
    });
  }
};


// =========================================
// GET MY PRODUCTS
// SELLER ONLY
// =========================================

const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const [products] = await db.query(
      `
      SELECT
        id,
        name,
        category,
        price,
        old_price AS oldPrice,
        description,
        image,
        stock,
        seller_id,
        status,
        rating,
        reviews,
        created_at AS createdAt
      FROM products
      WHERE seller_id = ?
      ORDER BY id DESC
      `,
      [sellerId]
    );

    return res.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Get my products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get seller products.",
      error: error.message,
    });
  }
};

// =========================================
// GET SINGLE PRODUCT
// =========================================

const getProductById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const [products] =
      await db.query(
        `
        SELECT
          id,
          name,
          category,
          price,
          old_price AS oldPrice,
          description,
          image,
          stock,
          rating,
          reviews,
          created_at AS createdAt
        FROM products
        WHERE id = ?
        `,
        [id]
      );

    // =======================================
    // NOT FOUND
    // =======================================

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    return res.json({
      success: true,
      product: products[0],
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get product.",
      error: error.message,
    });
  }
};


// =========================================
// UPDATE PRODUCT
// =========================================

const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    const {
      name,
      category,
      price,
      oldPrice,
      description,
      image,
      stock,
      rating,
    } = req.body;

    // =======================================
    // VALIDATION
    // =======================================

    if (
      !name ||
      price === undefined ||
      stock === undefined ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product name, price, stock and image are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Price cannot be negative.",
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Stock cannot be negative.",
      });
    }

    if (
      rating !== undefined &&
      rating !== null &&
      rating !== "" &&
      (Number(rating) < 0 ||
        Number(rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 0 and 5.",
      });
    }

    // =======================================
    // CHECK PRODUCT
    // =======================================

   let existing;

if (req.user.role === "admin") {

  [existing] = await db.query(
    `
    SELECT id
    FROM products
    WHERE id = ?
    `,
    [id]
  );

} else {

  [existing] = await db.query(
    `
    SELECT id
    FROM products
    WHERE id = ?
    AND seller_id = ?
    `,
    [id, sellerId]
  );
}

if (existing.length === 0) {
  return res.status(404).json({
    success: false,
    message:
      "Product not found.",
  });
}

    // =======================================
    // UPDATE
    // =======================================

    const sql = `
      UPDATE products
      SET
        name = ?,
        category = ?,
        price = ?,
        old_price = ?,
        description = ?,
        image = ?,
        stock = ?,
        rating = ?
      WHERE id = ?
    `;

    const values = [
      name.trim(),

      category || "Electronics",

      Number(price),

      oldPrice === "" ||
      oldPrice === undefined ||
      oldPrice === null
        ? null
        : Number(oldPrice),

      description
        ? description.trim()
        : "",

      image.trim(),

      Number(stock),

      rating === "" ||
      rating === undefined ||
      rating === null
        ? 4.5
        : Number(rating),

      id,
    ];

    const [result] =
      await db.query(
        sql,
        values
      );

    // =======================================
    // RESPONSE
    // =======================================

    return res.json({
      success: true,
      message:
        "Product updated successfully.",
      affectedRows:
        result.affectedRows,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update product.",
      error: error.message,
    });
  }
};


// =========================================
// DELETE PRODUCT
// =========================================



const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    let existingProduct;

    if (req.user.role === "admin") {

      [existingProduct] = await db.query(
        `
        SELECT id, name
        FROM products
        WHERE id = ?
        `,
        [id]
      );

    } else {

      [existingProduct] = await db.query(
        `
        SELECT id, name
        FROM products
        WHERE id = ?
        AND seller_id = ?
        `,
        [id, sellerId]
      );
    }

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // ADMIN CAN DELETE ANY PRODUCT
    if (req.user.role === "admin") {

      await db.query(
        `
        DELETE FROM products
        WHERE id = ?
        `,
        [id]
      );

    } else {

      // SELLER CAN DELETE ONLY OWN PRODUCT
      await db.query(
        `
        DELETE FROM products
        WHERE id = ?
        AND seller_id = ?
        `,
        [id, sellerId]
      );
    }

    return res.json({
      success: true,
      message: "Product deleted successfully.",
    });

  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};


// =========================================
// GET PENDING PRODUCTS
// ADMIN ONLY
// =========================================


// =========================================
// GET PENDING PRODUCTS
// ADMIN ONLY
// =========================================

const getPendingProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.*,
        s.name AS sellerName,
        s.store_name AS storeName
      FROM products p
      LEFT JOIN sellers s
        ON p.seller_id = s.id
      WHERE p.status = 'Pending'
      ORDER BY p.created_at DESC
    `);

    return res.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error(
      "Get pending products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get pending products.",
    });
  }
};


// =========================================
// APPROVE PRODUCT
// ADMIN ONLY
// =========================================

const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE products
      SET status = 'Active'
      WHERE id = ?
      AND status = 'Pending'
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Pending product not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Product approved successfully.",
    });

  } catch (error) {
    console.error(
      "Approve product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve product.",
    });
  }
};


// =========================================
// REJECT PRODUCT
// ADMIN ONLY
// =========================================

const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE products
      SET status = 'Rejected'
      WHERE id = ?
      AND status = 'Pending'
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Pending product not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Product rejected.",
    });

  } catch (error) {
    console.error(
      "Reject product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject product.",
    });
  }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  addProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};