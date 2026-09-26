import React, { useEffect, useMemo, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Lock,
  MapPin,
  Navigation,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  ShoppingBag,
  Loader2,
} from "lucide-react";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  // =====================================================
  // CUSTOMER
  // =====================================================

  const customer = JSON.parse(
    localStorage.getItem("customer")
  );

  const customerId = customer?.id;

  // =====================================================
  // LOCAL STORAGE KEYS
  // =====================================================

  const cartKey = customerId
    ? `cart_${customerId}`
    : "cart";

  const buyNowKey = customerId
    ? `buyNow_${customerId}`
    : "buyNow";

  const addressesKey = customerId
    ? `addresses_${customerId}`
    : "addresses";

  const selectedAddressKey = customerId
    ? `selectedAddress_${customerId}`
    : "selectedAddress";

  // =====================================================
  // STATE
  // =====================================================

  const [cart, setCart] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");

  const [addresses, setAddresses] =
    useState([]);

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState(null);

  const [
    gettingLocation,
    setGettingLocation,
  ] = useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("Online Payment");

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =====================================================
  // LOAD CART + ADDRESS
  // =====================================================

  useEffect(() => {
    const loadData = () => {
      try {
        const checkoutMode =
          localStorage.getItem(
            "checkoutMode"
          );

        const savedBuyNow =
          JSON.parse(
            localStorage.getItem(
              buyNowKey
            ) || "null"
          );

        const savedCart =
          JSON.parse(
            localStorage.getItem(
              cartKey
            ) || "[]"
          );

        // ===============================================
        // BUY NOW
        // ===============================================

        if (
          checkoutMode === "buyNow"
        ) {
          const buyNowItems =
            Array.isArray(savedBuyNow)
              ? savedBuyNow
              : savedBuyNow
                ? [savedBuyNow]
                : [];

          setCart(buyNowItems);
        } else {
          setCart(
            Array.isArray(savedCart)
              ? savedCart
              : []
          );
        }

        // ===============================================
        // ADDRESSES
        // ===============================================

        const savedAddresses =
          JSON.parse(
            localStorage.getItem(
              addressesKey
            ) || "[]"
          );

        const addressList =
          Array.isArray(
            savedAddresses
          )
            ? savedAddresses
            : [];

        setAddresses(
          addressList
        );

        const savedSelectedAddress =
          JSON.parse(
            localStorage.getItem(
              selectedAddressKey
            ) || "null"
          );

        // ===============================================
        // SELECTED ADDRESS
        // ===============================================

        if (
          savedSelectedAddress
        ) {
          setSelectedAddress(
            savedSelectedAddress
          );

          setForm(
            (previous) => ({
              ...previous,

              name:
                savedSelectedAddress.fullName ||
                "",

              phone:
                savedSelectedAddress.phone ||
                "",

              address:
                savedSelectedAddress.address ||
                "",

              city:
                savedSelectedAddress.city ||
                "",

              state:
                savedSelectedAddress.state ||
                "",

              pincode:
                savedSelectedAddress.pinCode ||
                "",
            })
          );
        } else if (
          addressList.length > 0
        ) {
          setSelectedAddress(
            addressList[0]
          );

          setForm(
            (previous) => ({
              ...previous,

              name:
                addressList[0].fullName ||
                "",

              phone:
                addressList[0].phone ||
                "",

              address:
                addressList[0].address ||
                "",

              city:
                addressList[0].city ||
                "",

              state:
                addressList[0].state ||
                "",

              pincode:
                addressList[0].pinCode ||
                "",
            })
          );
        }

      } catch (err) {
        console.error(
          "Checkout loading error:",
          err
        );

        setCart([]);
        setAddresses([]);

      } finally {
        setLoading(false);
      }
    };

    loadData();

    window.addEventListener(
      "cartUpdated",
      loadData
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadData
      );
    };

  }, [
    cartKey,
    buyNowKey,
    addressesKey,
    selectedAddressKey,
  ]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  const loadRazorpayScript =
    () => {
      return new Promise(
        (resolve) => {

          const existingScript =
            document.querySelector(
              'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            );

          if (
            existingScript
          ) {
            resolve(true);
            return;
          }

          const script =
            document.createElement(
              "script"
            );

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload =
            () => resolve(true);

          script.onerror =
            () => resolve(false);

          document.body.appendChild(
            script
          );
        }
      );
    };

  // =====================================================
  // TOTALS
  // =====================================================

  const subtotal =
    useMemo(() => {

      return cart.reduce(
        (
          total,
          item
        ) => {

          const price =
            Number(
              item.price || 0
            );

          const quantity =
            Number(
              item.quantity || 1
            );

          return (
            total +
            price * quantity
          );
        },
        0
      );

    }, [cart]);

  const deliveryCharge =
    subtotal >= 500 ||
    subtotal === 0
      ? 0
      : 40;

  const total =
    subtotal +
    deliveryCharge;

  // =====================================================
  // VALIDATE CHECKOUT
  // =====================================================

  const validateCheckout =
    () => {

      if (
        cart.length === 0
      ) {
        return "Your cart is empty.";
      }

      if (
        !form.name.trim()
      ) {
        return "Please enter your name.";
      }

      if (
        !form.email.trim()
      ) {
        return "Please enter your email.";
      }

      if (
        !form.phone.trim()
      ) {
        return "Please enter your phone number.";
      }

      if (
        !form.address.trim()
      ) {
        return "Please enter your delivery address.";
      }

      if (
        !form.city.trim()
      ) {
        return "Please enter your city.";
      }

      if (
        !form.state.trim()
      ) {
        return "Please enter your state.";
      }

      if (
        !form.pincode.trim()
      ) {
        return "Please enter your pincode.";
      }

      if (
        !paymentMethod
      ) {
        return "Please select a payment method.";
      }

      return "";
    };

  // =====================================================
  // CREATE CLOUDCART ORDER
  // =====================================================

  const createCloudCartOrder =
    async (
      token,
      items,
      paymentStatus,
      razorpayPaymentId = null
    ) => {

      const orderData = {

        customer_name:
          form.name.trim(),

        customer_email:
          form.email.trim(),

        phone:
          form.phone.trim(),

        address:
          form.address.trim(),

        city:
          form.city.trim(),

        state:
          form.state.trim(),

        pincode:
          form.pincode.trim(),

        subtotal_amount:
          Number(subtotal),

        delivery_charge:
          Number(
            deliveryCharge
          ),

        total_amount:
          Number(total),

        payment_method:
          paymentMethod,

        payment_status:
          paymentStatus,

        order_status:
          "Placed",

        items,

        razorpay_payment_id:
          razorpayPaymentId,
      };

      console.log(
        "Creating order:",
        orderData
      );

      const response =
        await fetch(
        "/api/orders",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                orderData
              ),
          }
        );

      const data =
        await response.json();

      console.log(
        "Create order response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Failed to create order."
        );
      }

      return data;
    };

  // =====================================================
  // CLEAR CHECKOUT
  // =====================================================

  const clearCheckout =
    () => {

      const checkoutMode =
        localStorage.getItem(
          "checkoutMode"
        );

      // ===============================================
      // BUY NOW
      // ===============================================

      if (
        checkoutMode === "buyNow"
      ) {
        localStorage.removeItem(
          buyNowKey
        );
      }

      // ===============================================
      // NORMAL CART
      // ===============================================

      else {
        localStorage.removeItem(
          cartKey
        );
      }

      localStorage.removeItem(
        "checkoutMode"
      );

      window.dispatchEvent(
        new Event(
          "cartUpdated"
        )
      );
    };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder =
    async () => {

      if (
        placingOrder
      ) {
        return;
      }

      setError("");

      // ===============================================
      // VALIDATION
      // ===============================================

      const validationError =
        validateCheckout();

      if (
        validationError
      ) {
        setError(
          validationError
        );

        return;
      }

      try {

        setPlacingOrder(
          true
        );

        // =============================================
        // TOKEN
        // =============================================

        const token =
          localStorage.getItem(
            "customerToken"
          );

        if (
          !token
        ) {
          setError(
            "Please login before placing an order."
          );

          navigate(
            "/customer/login"
          );

          return;
        }

        // =============================================
        // PREPARE ITEMS
        // =============================================

        const items =
          cart.map(
            (item) => ({

              product_id:
                item.product_id ||
                item.productId ||
                item.id,

              product_name:
                item.product_name ||
                item.productName ||
                item.name ||
                "Product",

              quantity:
                Number(
                  item.quantity ||
                  1
                ),

              price:
                Number(
                  item.price ||
                  0
                ),
            })
          );

        // =============================================
        // CASH ON DELIVERY
        // =============================================

        if (
          paymentMethod ===
          "Cash on Delivery"
        ) {

          await createCloudCartOrder(
            token,
            items,
            "Pending"
          );

          clearCheckout();

          alert(
            "Order placed successfully!"
          );

          navigate(
            "/customer/orders"
          );

          return;
        }

        // =============================================
        // LOAD RAZORPAY
        // =============================================

        const razorpayLoaded =
          await loadRazorpayScript();

        if (
          !razorpayLoaded
        ) {
          throw new Error(
            "Unable to load Razorpay. Please check your internet connection."
          );
        }

        // =============================================
        // CREATE RAZORPAY ORDER
        // =============================================

        const paymentResponse =
          await fetch(
            "/api/payment/create-order",
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  amount:
                    Number(total),
                }),
            }
          );

        const paymentData =
          await paymentResponse.json();

        if (
          !paymentResponse.ok ||
          !paymentData.success
        ) {
          throw new Error(
            paymentData.message ||
            "Unable to initialize payment."
          );
        }

        // =============================================
        // RAZORPAY OPTIONS
        // =============================================

        const options = {

          key:
            paymentData.key,

          amount:
            paymentData.order.amount,

          currency:
            paymentData.order.currency,

          name:
            "CloudCart",

          description:
            "CloudCart Order Payment",

          order_id:
            paymentData.order.id,

          prefill: {

            name:
              form.name.trim(),

            email:
              form.email.trim(),

            contact:
              form.phone.trim(),
          },

          theme: {
            color:
              "#2563eb",
          },

          // ===========================================
          // PAYMENT SUCCESS
          // ===========================================

          handler:
            async (
              razorpayResponse
            ) => {

              try {

                setPlacingOrder(
                  true
                );

                // =====================================
                // VERIFY PAYMENT
                // =====================================

                const verifyResponse =
                  await fetch(
                    "/api/payment/verify",
                    {
                      method:
                        "POST",

                      headers: {

                        Authorization:
                          `Bearer ${token}`,

                        "Content-Type":
                          "application/json",
                      },

                      body:
                        JSON.stringify({

                          razorpay_order_id:
                            razorpayResponse
                              .razorpay_order_id,

                          razorpay_payment_id:
                            razorpayResponse
                              .razorpay_payment_id,

                          razorpay_signature:
                            razorpayResponse
                              .razorpay_signature,
                        }),
                    }
                  );

                const verifyData =
                  await verifyResponse.json();

                if (
                  !verifyResponse.ok ||
                  !verifyData.success
                ) {
                  throw new Error(
                    verifyData.message ||
                    "Payment verification failed."
                  );
                }

                // =====================================
                // CREATE CLOUDCART ORDER
                // =====================================

                await createCloudCartOrder(
                  token,
                  items,
                  "Paid",
                  razorpayResponse
                    .razorpay_payment_id
                );

                // =====================================
                // CLEAR CART
                // =====================================

                clearCheckout();

                // =====================================
                // SUCCESS
                // =====================================

                alert(
                  "Payment successful! Order placed successfully."
                );

                navigate(
                  "/customer/orders"
                );

              } catch (
                paymentError
              ) {

                console.error(
                  "Payment processing error:",
                  paymentError
                );

                setError(
                  paymentError.message ||
                  "Payment was successful, but order creation failed."
                );

              } finally {

                setPlacingOrder(
                  false
                );
              }
            },

          // ===========================================
          // PAYMENT WINDOW CLOSED
          // ===========================================

          modal: {

            ondismiss:
              () => {

                setPlacingOrder(
                  false
                );
              },
          },
        };

        // =============================================
        // OPEN RAZORPAY
        // =============================================

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (err) {

        console.error(
          "Place order error:",
          err
        );

        setError(
          err.message ||
          "Unable to place order."
        );

        setPlacingOrder(
          false
        );
      }
    };

  // =====================================================
  // SELECT ADDRESS
  // =====================================================

  const handleSelectAddress =
    (
      address
    ) => {

      setSelectedAddress(
        address
      );

      localStorage.setItem(
        selectedAddressKey,
        JSON.stringify(
          address
        )
      );

      setForm(
        (previous) => ({
          ...previous,

          name:
            address.fullName ||
            "",

          phone:
            address.phone ||
            "",

          address:
            address.address ||
            "",

          city:
            address.city ||
            "",

          state:
            address.state ||
            "",

          pincode:
            address.pinCode ||
            "",
        })
      );
    };

  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

  const handleUseCurrentLocation =
    () => {

      if (
        !navigator.geolocation
      ) {
        setError(
          "Geolocation is not supported by your browser."
        );

        return;
      }

      setError("");

      setGettingLocation(
        true
      );

      navigator.geolocation.getCurrentPosition(

        async (
          position
        ) => {

          try {

            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            // ===========================================
            // GET ADDRESS FROM COORDINATES
            // ===========================================

            const response =
              await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
              );

            const data =
              await response.json();

            if (
              !data ||
              !data.address
            ) {
              throw new Error(
                "Unable to find address."
              );
            }

            const location =
              data.address;

            // ===========================================
            // ADDRESS
            // ===========================================

            const fullAddress =
              [
                location.house_number,
                location.road,
                location.suburb,
                location.neighbourhood,
              ]
                .filter(
                  Boolean
                )
                .join(", ");

            const city =
              location.city ||
              location.town ||
              location.village ||
              location.county ||
              "";

            const state =
              location.state ||
              "";

            const pincode =
              location.postcode ||
              "";

            // ===========================================
            // UPDATE FORM
            // ===========================================

            setForm(
              (
                previous
              ) => ({
                ...previous,

                address:
                  fullAddress ||
                  data.display_name ||
                  "",

                city,

                state,

                pincode,
              })
            );

            setSelectedAddress(
              null
            );

          } catch (err) {

            console.error(
              "Location error:",
              err
            );

            setError(
              "Unable to get your address from your current location."
            );

          } finally {

            setGettingLocation(
              false
            );
          }
        },

        (
          locationError
        ) => {

          console.error(
            "Geolocation error:",
            locationError
          );

          setGettingLocation(
            false
          );

          if (
            locationError.code ===
            locationError.PERMISSION_DENIED
          ) {
            setError(
              "Location permission was denied. Please allow location access."
            );
          } else {
            setError(
              "Unable to get your current location."
            );
          }
        },

        {
          enableHighAccuracy:
            true,

          timeout:
            10000,

          maximumAge:
            0,
        }
      );
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading
  ) {
    return (
      <main className="checkout-page">

        <div className="checkout-loading">

          <Loader2
            size={45}
            className="checkout-spinner"
          />

          <h2>
            Loading Checkout...
          </h2>

          <p>
            Preparing your order.
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (
    cart.length === 0
  ) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <ShoppingBag
            size={60}
          />

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add products before
            going to checkout.
          </p>

          <Link
            to="/customer/products"
            className="checkout-shop-button"
          >
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="checkout-page">

      {/* TOP */}

      <div className="checkout-top">

      <button
  type="button"
  className="back-button"
  onClick={() => {
    if (localStorage.getItem("checkoutMode") === "buyNow") {
      localStorage.removeItem("checkoutMode");
      navigate(-1);
    } else {
      navigate("/customer/cart");
    }
  }}
>
  <ArrowLeft size={20} />
  <span>Back</span>
</button>

        <div className="checkout-security">

          <Lock
            size={16}
          />

          Secure Checkout

        </div>

      </div>

      {/* HEADER */}

      <header className="checkout-header">

        <span className="checkout-label">
          CLOUDCART
        </span>

        <h1>
          Checkout
        </h1>

        <p>
          Complete your delivery,
          payment and order details.
        </p>

      </header>

      {/* ERROR */}

      {error && (

        <div className="checkout-error">

          {error}

        </div>
      )}

      {/* LAYOUT */}

      <div className="checkout-layout">

        {/* LEFT */}

        <section className="checkout-left">

          {/* DELIVERY ADDRESS */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-icon">

                <MapPin
                  size={22}
                />

              </div>

              <div>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Where should we deliver
                  your order?
                </p>

              </div>

            </div>

            {/* CURRENT LOCATION */}

            <div className="current-location-card">

              <div className="current-location-content">

                <div className="current-location-icon">

                  <Navigation
                    size={22}
                  />

                </div>

                <div>

                  <h3>
                    Use Current Location
                  </h3>

                  <p>
                    Get your current delivery address
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="use-location-button"
                onClick={
                  handleUseCurrentLocation
                }
                disabled={
                  gettingLocation
                }
              >

                {gettingLocation ? (

                  <>

                    <Loader2
                      size={18}
                      className="checkout-spinner"
                    />

                    Getting...

                  </>

                ) : (

                  "Use"

                )}

              </button>

            </div>

            <div className="address-or">

              <span>
                OR
              </span>

            </div>

            {/* SAVED ADDRESSES */}

            {addresses.length > 0 && (

              <div className="saved-addresses">

                <h3>
                  Saved Addresses
                </h3>

                <div className="saved-address-list">

                  {addresses.map(
                    (
                      address,
                      index
                    ) => {

                      const isSelected =
                        selectedAddress &&
                        (
                          selectedAddress.id
                            ? selectedAddress.id ===
                              address.id
                            : index === 0
                        );

                      return (

                        <button
                          type="button"
                          key={
                            address.id ||
                            index
                          }
                          className={
                            `saved-address-option ${
                              isSelected
                                ? "address-selected"
                                : ""
                            }`
                          }
                          onClick={
                            () =>
                              handleSelectAddress(
                                address
                              )
                          }
                        >

                          <div>

                            <strong>

                              {address.fullName ||
                                "Delivery Address"}

                            </strong>

                            <span>

                              {address.address ||
                                ""}

                            </span>

                            <span>

                              {address.city ||
                                ""}

                              {address.city &&
                              address.state
                                ? ", "
                                : ""}

                              {address.state ||
                                ""}

                              {address.pinCode
                                ? ` - ${address.pinCode}`
                                : ""}

                            </span>

                          </div>

                          {isSelected && (

                            <CheckCircle
                              size={21}
                            />

                          )}

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* ADDRESS FORM */}

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Enter full name"
                />

              </div>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={
                    handleChange
                  }
                  placeholder="Enter email"
                />

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleChange
                  }
                  placeholder="Enter phone number"
                />

              </div>

              <div className="form-group">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter pincode"
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="House number, street, area"
                  rows="3"
                />

              </div>

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={
                    handleChange
                  }
                  placeholder="Enter city"
                />

              </div>

              <div className="form-group">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={
                    handleChange
                  }
                  placeholder="Enter state"
                />

              </div>

            </div>

          </div>

          {/* PAYMENT */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-icon">

                <CreditCard
                  size={22}
                />

              </div>

              <div>

                <h2>
                  Payment
                </h2>

                <p>
                  Select your preferred
                  payment method.
                </p>

              </div>

            </div>

            <div className="payment-options">

              {/* ONLINE PAYMENT */}

              <label
                className={
                  `payment-option ${
                    paymentMethod ===
                    "Online Payment"
                      ? "payment-selected"
                      : ""
                  }`
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online Payment"
                  checked={
                    paymentMethod ===
                    "Online Payment"
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setPaymentMethod(
                        event.target.value
                      )
                  }
                />

                <div className="payment-option-icon">

                  <CreditCard
                    size={21}
                  />

                </div>

                <div className="payment-info">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    UPI, Credit Card,
                    Debit Card and more
                  </span>

                </div>

                {paymentMethod ===
                  "Online Payment" && (

                  <CheckCircle
                    className="payment-check"
                    size={21}
                  />

                )}

              </label>

              {/* CASH ON DELIVERY */}

              <label
                className={
                  `payment-option ${
                    paymentMethod ===
                    "Cash on Delivery"
                      ? "payment-selected"
                      : ""
                  }`
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setPaymentMethod(
                        event.target.value
                      )
                  }
                />

                <div className="payment-option-icon">

                  <Banknote
                    size={21}
                  />

                </div>

                <div className="payment-info">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order
                    arrives
                  </span>

                </div>

                {paymentMethod ===
                  "Cash on Delivery" && (

                  <CheckCircle
                    className="payment-check"
                    size={21}
                  />

                )}

              </label>

            </div>

          </div>

        </section>

        {/* ORDER SUMMARY */}

        <aside className="checkout-summary">

          <div className="summary-heading">

            <h2>
              Order Summary
            </h2>

            <span>

              {cart.length} item

              {cart.length !== 1
                ? "s"
                : ""}

            </span>

          </div>

          {/* PRODUCTS */}

          <div className="checkout-products">

            {cart.map(
              (
                item,
                index
              ) => {

                const quantity =
                  Number(
                    item.quantity ||
                    1
                  );

                const price =
                  Number(
                    item.price ||
                    0
                  );

                return (

                  <div
                    className="checkout-product"
                    key={
                      item.id ||
                      item.product_id ||
                      index
                    }
                  >

                    <img
                      src={
                        item.image ||
                        item.product_image ||
                        ""
                      }
                      alt={
                        item.name ||
                        item.product_name ||
                        "Product"
                      }
                    />

                    <div className="checkout-product-info">

                      <strong>

                        {item.name ||
                          item.product_name ||
                          "Product"}

                      </strong>

                      <span>

                        Qty:{" "}

                        {quantity}

                      </span>

                    </div>

                    <strong>

                      ₹

                      {(
                        price *
                        quantity
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>
                );
              }
            )}

          </div>

          <div className="summary-line" />

          {/* SUBTOTAL */}

          <div className="checkout-summary-row">

            <span>
              Subtotal
            </span>

            <strong>

              ₹

              {subtotal.toLocaleString(
                "en-IN"
              )}

            </strong>

          </div>

          {/* DELIVERY */}

          <div className="checkout-summary-row">

            <span>
              Delivery
            </span>

            <strong
              className={
                deliveryCharge === 0
                  ? "free-delivery"
                  : ""
              }
            >

              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`}

            </strong>

          </div>

          <div className="summary-line" />

          {/* TOTAL */}

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>

              ₹

              {total.toLocaleString(
                "en-IN"
              )}

            </strong>

          </div>

          {/* PLACE ORDER */}

          <button
            type="button"
            className="place-order-button"
            disabled={
              placingOrder
            }
            onClick={
              handlePlaceOrder
            }
          >

            {placingOrder ? (

              <>

                <Loader2
                  size={19}
                  className="checkout-spinner"
                />

                Processing...

              </>

            ) : (

              <>

                <CheckCircle
                  size={19}
                />

                Place Order

              </>

            )}

          </button>

          <div className="secure-message">

            <Lock
              size={14}
            />

            Secure and protected
            checkout

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;



