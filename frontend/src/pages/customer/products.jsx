import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  MapPin,
  Search,
  X,
  Crosshair,
  Package,
} from "lucide-react";

import "./products.css";


function Products() {

  const navigate = useNavigate();

  const customer = JSON.parse(
    localStorage.getItem("customer")
  );

  const customerId = customer?.id;

  const cartKey = customerId
    ? `cart_${customerId}`
    : "cart";

  const wishlistKey = customerId
    ? `wishlist_${customerId}`
    : "wishlist";


  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [wishlist, setWishlist] =
    useState([]);

  const [cart, setCart] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

   

const [inStockOnly, setInStockOnly] =
  useState(false);

  const [maxPrice, setMaxPrice] =
  useState(50000);

  const [locationOpen, setLocationOpen] =
  useState(false);

const [locationLoading, setLocationLoading] =
  useState(false);

const [currentLocation, setCurrentLocation] =
  useState(null);

const [locationError, setLocationError] =
  useState("");


  const [locationName, setLocationName] =
  useState("");

const [location, setLocation] =
  useState("Location");


  const [addressSearch, setAddressSearch] =
  useState("");

const [addressResults, setAddressResults] =
  useState([]);

const [addressLoading, setAddressLoading] =
  useState(false);
  const [pendingLocation, setPendingLocation] =
  useState(null);

  const [profileMenuOpen, setProfileMenuOpen] =
  useState(false);
  /* ========================================
   GET CURRENT LOCATION
======================================== */

const getCurrentLocation = () => {

  if (!navigator.geolocation) {

    setLocationError(
      "Location is not supported by your browser."
    );

    return;

  }

  setLocationLoading(true);
  setLocationError("");

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      setCurrentLocation({
        latitude,
        longitude,
      });

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {

          throw new Error(
            "Unable to find address."
          );

        }

        const data =
          await response.json();

        console.log(
          "Location data:",
          data
        );

        const addressData = data.address || {};

const address =
  addressData.suburb ||
  addressData.neighbourhood ||
  addressData.city_district ||
  addressData.city ||
  addressData.town ||
  data.display_name ||
  `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

     setLocationName(address);

setPendingLocation({
  name: address,
  latitude,
  longitude,
}); 

      } catch (error) {

        console.error(
          "Address error:",
          error
        );

        const fallbackLocation =
          `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      setLocationName(
  fallbackLocation
);

setLocationName(
  fallbackLocation
);

setPendingLocation({
  name: fallbackLocation,
  latitude,
  longitude,
});

      } finally {

        setLocationLoading(false);

      }

    },

    (error) => {

      console.error(
        "Location error:",
        error
      );

      setLocationError(
        "Please allow location permission."
      );

      setLocationLoading(false);

    }

  );

};
const searchAddress = async (value) => {

  setAddressSearch(value);

  if (value.trim().length < 3) {

    setAddressResults([]);
    return;

  }

  try {

    setAddressLoading(true);

    const response =
      await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          value
        )}&limit=5`
      );

    const data =
      await response.json();

    setAddressResults(data);

  } catch (error) {

    console.error(
      "Address search error:",
      error
    );

    setAddressResults([]);

  } finally {

    setAddressLoading(false);

  }

};

const selectAddress = (place) => {

  const latitude =
    Number(place.lat);

  const longitude =
    Number(place.lon);

  const address =
    place.display_name;

  setCurrentLocation({
    latitude,
    longitude,
  });

  setLocationName(address);

  setPendingLocation({
    name: address,
    latitude,
    longitude,
  });

  setAddressSearch("");

  setAddressResults([]);

};


    

  

  

  

  



  /* ========================================
     LOAD PRODUCTS
  ======================================== */

  const loadProducts = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
          "/api/products"
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load products."
        );

      }

      setProducts(
        data.products || []
      );

    } catch (error) {

      console.error(
        "Products error:",
        error
      );

      setError(
        error.message ||
        "Unable to load products."
      );

    } finally {

      setLoading(false);

    }

  };


  /* ========================================
     LOAD DATA
  ======================================== */

  
useEffect(() => {

  loadProducts();

  try {

    // LOAD SAVED LOCATION
    const savedLocation =
      JSON.parse(
        localStorage.getItem(
          "customerLocation"
        )
      );

    if (savedLocation) {

      setLocationName(
        savedLocation.name
      );

      setLocation(
        savedLocation.name
      );

      setCurrentLocation({
        latitude:
          savedLocation.latitude,
        longitude:
          savedLocation.longitude,
      });

    }


    // LOAD WISHLIST
    const savedWishlist =
      JSON.parse(
        localStorage.getItem(
          wishlistKey
        )
      ) || [];

    setWishlist(
      savedWishlist
    );


    // LOAD CART
    const savedCart =
      JSON.parse(
        localStorage.getItem(
          cartKey
        )
      ) || [];

    setCart(
      savedCart
    );

  } catch (error) {

    console.error(
      "Local storage error:",
      error
    );

  }

}, [cartKey, wishlistKey]);



  /* ========================================
     OPEN PRODUCT
  ======================================== */

  const openProduct = (id) => {
  navigate(
    `/customer/products/${id}`,
    {
      state: {
        from: "products",
      },
    }
  );
};


  /* ========================================
     ADD TO CART
  ======================================== */

  const addToCart = (product) => {

    if (
      Number(product.stock) <= 0
    ) {

      alert(
        "Product is out of stock."
      );

      return;

    }

    const savedCart =
      JSON.parse(
        localStorage.getItem(
          cartKey
        )
      ) || [];

    const existingProduct =
      savedCart.find(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    let updatedCart;

    if (existingProduct) {

      if (
        Number(
          existingProduct.quantity
        ) >= Number(product.stock)
      ) {

        alert(
          "You cannot add more than available stock."
        );

        return;

      }

      updatedCart =
        savedCart.map(
          (item) =>
            Number(item.id) ===
            Number(product.id)
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity || 0
                    ) + 1,
                }
              : item
        );

    } else {

      updatedCart = [
        ...savedCart,
        {
          ...product,
          quantity: 1,
        },
      ];

    }

    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    );

    setCart(
      updatedCart
    );

  };


  /* ========================================
     BUY NOW
  ======================================== */

  const buyNow = (product) => {

    if (
      Number(product.stock) <= 0
    ) {

      alert(
        "Product is out of stock."
      );

      return;

    }

    const buyNowKey =
      customerId
        ? `buyNow_${customerId}`
        : "buyNow";

    const buyNowProduct = [
      {
        ...product,
        quantity: 1,
      },
    ];

    localStorage.setItem(
      buyNowKey,
      JSON.stringify(buyNowProduct)
    );

    localStorage.setItem(
      "checkoutMode",
      "buyNow"
    );

    navigate(
      "/customer/checkout"
    );

  };


  /* ========================================
     WISHLIST
  ======================================== */

  const toggleWishlist = (
    product
  ) => {

    const savedWishlist =
      JSON.parse(
        localStorage.getItem(
          wishlistKey
        )
      ) || [];

    const exists =
      savedWishlist.some(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    let updatedWishlist;

    if (exists) {

      updatedWishlist =
        savedWishlist.filter(
          (item) =>
            Number(item.id) !==
            Number(product.id)
        );

    } else {

      updatedWishlist = [
        ...savedWishlist,
        product,
      ];

    }

    localStorage.setItem(
      wishlistKey,
      JSON.stringify(updatedWishlist)
    );

    setWishlist(
      updatedWishlist
    );

  };


  /* ========================================
     FILTER PRODUCTS
  ======================================== */

  const filteredProducts =
  products.filter(
    (product) => {

      const productName =
        product.name
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const productCategory =
        product.category
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const searchMatch =
        productName ||
        productCategory;

      const categoryMatch =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      const priceMatch =
        Number(product.price) <=
        Number(maxPrice);

      const stockMatch =
        !inStockOnly ||
        Number(product.stock) > 0;

      return (
        searchMatch &&
        categoryMatch &&
        priceMatch &&
        stockMatch
      );

    }
  );
  


  /* ========================================
     UNIQUE CATEGORIES
  ======================================== */

  const categories = [
    "All",
    ...[
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ],
  ];


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (
      <div className="products-loading">

        <h2>
          Loading Products...
        </h2>

      </div>
    );

  }


  /* ========================================
     ERROR
  ======================================== */

  if (error) {

    return (
      <div className="products-error-page">

        <div className="products-error-card">

          <h1>
            Unable to Load Products
          </h1>

          <p>
            {error}
          </p>

          <button
            onClick={loadProducts}
          >
            Try Again
          </button>

        </div>

      </div>
    );

  }


  return (

    <div className="products-page">

      {locationOpen && (

  <div className="location-modal-overlay">

    <div className="location-modal">

      {/* HEADER */}

      <div className="location-modal-header">

        <h2>
          Your Location
        </h2>

        <button
          type="button"
          className="location-close-button"
          onClick={() =>
            setLocationOpen(false)
          }
        >

          <X size={20} />

        </button>

      </div>


      {/* SEARCH */}

      <div className="location-search">

        <Search size={20} />

       <input
  type="text"
  placeholder="Search a new address"
  value={addressSearch}
  onChange={(event) =>
    searchAddress(
      event.target.value
    )
  }
/>

      </div>

      {addressLoading && (

  <p className="address-search-loading">
    Searching...
  </p>

)}


{addressResults.length > 0 && (

  <div className="address-results">

    {addressResults.map(
      (place) => (

        <button
          key={place.place_id}
          type="button"
          className="address-result-item"
          onClick={() =>
            selectAddress(place)
          }
        >

          <MapPin size={18} />

          <span>
            {place.display_name}
          </span>

        </button>

      )
    )}

  </div>

)}

      {/* CURRENT LOCATION */}

      <div className="current-location-card">

        <div className="location-target-icon">

          <Crosshair size={28} />

        </div>


        <div className="current-location-text">

          <h3>
            Use My Current Location
          </h3>

          <p>
            Enable your current location for better services
          </p>

        </div>


        <button
          type="button"
          className="enable-location-button"
          onClick={getCurrentLocation}
          disabled={
            locationLoading
          }
        >

          {locationLoading
            ? "Getting..."
            : "Enable"}

        </button>

      </div>


      {/* ERROR */}

      {locationError && (

        <p className="location-error">

          {locationError}

        </p>

      )}


      {/* MAP */}

      
       

      {currentLocation && (

  <div className="location-map">

    <iframe
      title="Current Location Map"
      width="100%"
      height="300"
      style={{
        border: 0,
      }}
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
        currentLocation.longitude - 0.01
      }%2C${
        currentLocation.latitude - 0.01
      }%2C${
        currentLocation.longitude + 0.01
      }%2C${
        currentLocation.latitude + 0.01
      }&layer=mapnik&marker=${
        currentLocation.latitude
      }%2C${
        currentLocation.longitude
      }`}
    />

    <p className="location-coordinates">
      📍 {locationName || "Getting address..."}
    </p>

  </div>

)}

{/* CONFIRM LOCATION BUTTON */}

<button
  type="button"
  className="confirm-location-button"
  disabled={!pendingLocation}
  onClick={() => {

    localStorage.setItem(
      "customerLocation",
      JSON.stringify(pendingLocation)
    );

    setLocation(
      pendingLocation.name
    );

    setLocationName(
      pendingLocation.name
    );

    setCurrentLocation({
      latitude:
        pendingLocation.latitude,
      longitude:
        pendingLocation.longitude,
    });

    setLocationOpen(false);

  }}
>
  Confirm Location
</button>  

      

    </div>

  </div>

)}


     {/* ====================================
    TOP HEADER
==================================== */}

<header className="store-header">

  <div className="store-logo">

    <strong>
      CloudCart
    </strong>

  </div>


  <button
    className="location-button"
    type="button"
    onClick={() =>
      setLocationOpen(true)
    }
  >

    <MapPin size={18} />

    <span>
      {currentLocation
        ? locationName
        : "Location"}
    </span>

  </button>


  <div className="search-box">

    <select
      value={selectedCategory}
      onChange={(event) =>
        setSelectedCategory(
          event.target.value
        )
      }
    >

      {categories.map(
        (category) => (

          <option
            key={category}
            value={category}
          >

            {category}

          </option>

        )
      )}

    </select>


    <div className="search-input">

      <Search size={19} />

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(
            event.target.value
          )
        }
      />

    </div>

  </div>


 <div className="header-actions">

  <div className="profile-menu">

    <button
      type="button"
      className="header-icon-button"
      onClick={() =>
        setProfileMenuOpen(!profileMenuOpen)
      }
      title="Profile"
    >
      👤
    </button>

    {profileMenuOpen && (

      <div className="profile-dropdown">

        <button
          type="button"
          className="profile-dropdown-item"
          onClick={() =>
            navigate("/customer/profile")
          }
        >
          👤
          <span>My Profile</span>
        </button>

        <button
          type="button"
          className="profile-dropdown-item logout-item"
          onClick={() => {

            localStorage.removeItem("customer");

            navigate("/customer/login");

          }}
        >
          🚪
          <span>Logout</span>
        </button>

      </div>

    )}

  </div>

</div>

</header>


{/* ====================================
    CATEGORY + CUSTOMER ACTION NAVIGATION
==================================== */}

<nav className="category-navigation">

  <div className="category-links">

    {categories
      .slice(0, 6)
      .map(
        (category) => (

          <button
            key={category}
            type="button"
            className={
              selectedCategory ===
              category
                ? "category-nav-link active"
                : "category-nav-link"
            }
            onClick={() =>
              setSelectedCategory(
                category
              )
            }
          >

            {category}

          </button>

        )
      )}

  </div>


  <div className="customer-navigation-actions">


    {/* WISHLIST */}

    <button
      type="button"
      className="customer-nav-button"
      onClick={() =>
        navigate(
          "/customer/wishlist"
        )
      }
    >

      <Heart size={19} />

      <span>
        Wishlist
      </span>

      {wishlist.length > 0 && (

        <span className="nav-count-badge">

          {wishlist.length}

        </span>

      )}

    </button>


    {/* MY ORDERS */}

    <button
      type="button"
      className="customer-nav-button"
      onClick={() =>
        navigate(
          "/customer/orders"
        )
      }
    >

      <Package size={19} />

      <span>
        My Orders
      </span>

    </button>


    {/* CART */}

    <button
      type="button"
      className="cart-top-button"
      onClick={() =>
        navigate(
          "/customer/cart"
        )
      }
    >

      <ShoppingCart size={20} />

      <span>
        Cart
      </span>

      {cart.length > 0 && (

        <span className="cart-badge">

          {cart.reduce(
            (total, item) =>
              total +
              Number(
                item.quantity || 0
              ),
            0
          )}

        </span>

      )}

    </button>

  </div>

</nav> 

    



      {/* ====================================
          CUSTOMER MENU
      ==================================== */}

<div className="products-content">

  {/* ====================================
    LOCATION POPUP
==================================== */}


<aside className="filters-sidebar">

  <h2>
    Filters
  </h2>


  {/* CATEGORY */}

  <div className="filter-section">

    <label>
      Category
    </label>

    <select
      value={selectedCategory}
      onChange={(event) =>
        setSelectedCategory(
          event.target.value
        )
      }
    >

      {categories.map(
        (category) => (

          <option
            key={category}
            value={category}
          >

            {category}

          </option>

        )
      )}

    </select>

  </div>


  {/* PRICE RANGE */}

  <div className="filter-section">

    <label>
      Price Range
    </label>

    <input
      type="range"
      min="0"
      max="50000"
      step="500"
      value={maxPrice}
      onChange={(event) =>
        setMaxPrice(
          event.target.value
        )
      }
    />

    <p>
      Up to ₹
      {Number(maxPrice).toLocaleString(
        "en-IN"
      )}
    </p>

  </div>


  {/* AVAILABILITY */}

  <div className="filter-section">

    <label className="filter-checkbox">

      <input
        type="checkbox"
        checked={inStockOnly}
        onChange={(event) =>
          setInStockOnly(
            event.target.checked
          )
        }
      />

      <span>
        In Stock Only
      </span>

    </label>

  </div>


  {/* CLEAR FILTERS */}

  <button
    type="button"
    className="clear-filter-button"
    onClick={() => {

      setSelectedCategory("All");

      setMaxPrice(50000);

      setInStockOnly(false);

      setSearchTerm("");

    }}
  >

    Clear Filters

  </button>

</aside>


 


        {/* ==================================
            LEFT FILTER SIDEBAR
        ================================== */}

       


        {/* ==================================
            PRODUCTS CONTENT
        ================================== */}

       

 

        <main className="products-main">


          <div className="products-main-header">

            <div>

              <span>
                CLOUDCART STORE
              </span>

              <h1>
                All Products
              </h1>

              <p>
                Browse products available
                from our sellers.
              </p>

            </div>


            <div className="product-count">

              {filteredProducts.length}
              {" "}
              Products

            </div>

          </div>


          {/* EMPTY */}

          {filteredProducts.length ===
          0 ? (

            <div className="products-empty">

              <h2>
                No Products Found
              </h2>

              <p>
                Try changing your filters.
              </p>

            </div>

          ) : (

            <section className="products-grid">

              {filteredProducts.map(
                (product) => (

                  <article
  className="product-card"
  key={product.id}
  onClick={() => openProduct(product.id)}
  style={{ cursor: "pointer" }}
>


                    {/* IMAGE */}

                    <div
                      className="product-image"
                      onClick={() =>
                        openProduct(
                          product.id
                        )
                      }
                    >

                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/500x400?text=CloudCart"
                        }
                        alt={
                          product.name
                        }
                      />


                      {/* WISHLIST */}

                      <button
                        type="button"
                        className="wishlist-button"
                        onClick={(
                          event
                        ) => {

                          event.stopPropagation();

                          toggleWishlist(
                            product
                          );

                        }}
                      >

                        <Heart
                          size={20}
                          fill={
                            wishlist.some(
                              (item) =>
                                Number(
                                  item.id
                                ) ===
                                Number(
                                  product.id
                                )
                            )
                              ? "currentColor"
                              : "none"
                          }
                        />

                      </button>

                    </div>


                    {/* INFO */}

                    <div className="product-info">

                      <span className="product-category">

                        {product.category ||
                          "General"}

                      </span>


                      <h3
                        className="product-name"
                        onClick={() =>
                          openProduct(
                            product.id
                          )
                        }
                      >

                        {product.name}

                      </h3>


                  <div className="product-price">
  {Number(product.oldPrice || 0) > 0 && (
    <del>
      ₹{Number(product.oldPrice).toLocaleString("en-IN")}
    </del>
  )}

  <strong>
    ₹{Number(product.price || 0).toLocaleString("en-IN")}
  </strong>
</div>


                      <div className="product-stock">

                        {Number(
                          product.stock
                        ) > 0
                          ? `${product.stock} in stock`
                          : "Out of Stock"}

                      </div>


                      <div className="product-actions">

                        <button
                          type="button"
                          className="add-cart-button"
                          disabled={
                            Number(
                              product.stock
                            ) <= 0
                          }
                          onClick={(event) => {
  event.stopPropagation();

  addToCart(product);
}}
                        >

                          <ShoppingCart
                            size={18}
                          />

                          Add to Cart

                        </button>


                        <button
                          type="button"
                          className="buy-now-button"
                          disabled={
                            Number(
                              product.stock
                            ) <= 0
                          }
                          onClick={(event) => {
  event.stopPropagation();

  buyNow(product);
}}
                        >

                          Buy Now

                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </section>

          )}

        </main>

      </div>
  </div>
  

  );


}

export default Products;



