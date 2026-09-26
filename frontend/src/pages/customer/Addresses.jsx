import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  X,
  Save,
  Truck,
  Home,
} from "lucide-react";

import "./Addresses.css";

function Addresses() {
  const navigate = useNavigate();

  // =========================================
  // CUSTOMER-SPECIFIC STORAGE KEYS
  // =========================================

  const customer = JSON.parse(
    localStorage.getItem("customer")
  );

  const customerId = customer?.id;

  const addressesKey = customerId
    ? `addresses_${customerId}`
    : "customerAddresses";

  const selectedAddressKey = customerId
    ? `selectedAddress_${customerId}`
    : "selectedAddress";

  // =========================================
  // STATES
  // =========================================

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  // =========================================
  // LOAD ADDRESSES
  // =========================================

  useEffect(() => {
    const savedAddresses =
      JSON.parse(
        localStorage.getItem(addressesKey)
      ) || [];

    setAddresses(savedAddresses);
  }, [addressesKey]);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =========================================
  // OPEN ADD FORM
  // =========================================

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // SAVE ADDRESS
  // =========================================

  const saveAddress = (event) => {
    event.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pinCode.trim()
    ) {
      alert("Please fill all address fields.");
      return;
    }

    let updatedAddresses;

    // EDIT
    if (editingId !== null) {
      updatedAddresses = addresses.map(
        (item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
              }
            : item
      );
    }

    // ADD
    else {
      const newAddress = {
        id: Date.now(),
        ...form,
        isDefault: addresses.length === 0,
      };

      updatedAddresses = [
        ...addresses,
        newAddress,
      ];
    }

    setAddresses(updatedAddresses);

    localStorage.setItem(
      addressesKey,
      JSON.stringify(updatedAddresses)
    );

    // If the edited address was selected,
    // update selected address too.
    if (editingId !== null) {
      const selectedAddress = JSON.parse(
        localStorage.getItem(selectedAddressKey)
      );

      if (
        selectedAddress &&
        selectedAddress.id === editingId
      ) {
        const updatedSelectedAddress =
          updatedAddresses.find(
            (item) => item.id === editingId
          );

        localStorage.setItem(
          selectedAddressKey,
          JSON.stringify(updatedSelectedAddress)
        );
      }
    }

    resetForm();
  };

  // =========================================
  // EDIT ADDRESS
  // =========================================

  const editAddress = (address) => {
    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pinCode: address.pinCode || "",
    });

    setEditingId(address.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // DELETE ADDRESS
  // =========================================

  const deleteAddress = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedAddresses =
      addresses.filter(
        (item) => item.id !== id
      );

    let finalAddresses =
      updatedAddresses;

    // Make first remaining address default
    if (
      updatedAddresses.length > 0 &&
      !updatedAddresses.some(
        (item) => item.isDefault
      )
    ) {
      finalAddresses =
        updatedAddresses.map(
          (item, index) => ({
            ...item,
            isDefault: index === 0,
          })
        );
    }

    setAddresses(finalAddresses);

    localStorage.setItem(
      addressesKey,
      JSON.stringify(finalAddresses)
    );

    // Remove selected address if deleted
    const selectedAddress = JSON.parse(
      localStorage.getItem(selectedAddressKey)
    );

    if (
      selectedAddress &&
      selectedAddress.id === id
    ) {
      localStorage.removeItem(
        selectedAddressKey
      );
    }
  };

  // =========================================
  // SET DEFAULT ADDRESS
  // =========================================

  const setDefaultAddress = (id) => {
    const updatedAddresses =
      addresses.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }));

    setAddresses(updatedAddresses);

    localStorage.setItem(
      addressesKey,
      JSON.stringify(updatedAddresses)
    );
  };

  // =========================================
  // SELECT ADDRESS FOR CHECKOUT
  // =========================================

  const selectAddress = (address) => {
    localStorage.setItem(
      selectedAddressKey,
      JSON.stringify(address)
    );

    alert(
      "Delivery address selected successfully."
    );

    navigate("/customer/checkout");
  };

  return (
    <main className="addresses-page">

      <Link
        to="/customer/dashboard"
        className="addresses-back"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <section className="addresses-header">

        <div>
          <span className="addresses-label">
            CLOUDCART ACCOUNT
          </span>

          <h1>My Addresses</h1>

          <p>
            Save and manage your delivery
            addresses.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="add-address-button"
            onClick={openAddForm}
          >
            <Plus size={19} />
            Add New Address
          </button>
        )}

      </section>

      {showForm && (
        <section className="address-form-card">

          <div className="address-form-top">

            <div className="address-form-title">

              <div className="address-form-icon">
                <MapPin size={22} />
              </div>

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p>
                  Enter your complete delivery
                  information.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="close-address-form"
              onClick={resetForm}
            >
              <X size={20} />
            </button>

          </div>

          <form
            className="address-form"
            onSubmit={saveAddress}
          >

            <div className="address-fields">

              <div className="address-field">
                <label>Full Name</label>

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Vineeth M"
                />
              </div>

              <div className="address-field">
                <label>Phone Number</label>

                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                />
              </div>

              <div className="address-field full-width">
                <label>Address</label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  rows="3"
                />
              </div>

              <div className="address-field">
                <label>City</label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                />
              </div>

              <div className="address-field">
                <label>State</label>

                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                />
              </div>

              <div className="address-field">
                <label>PIN Code</label>

                <input
                  name="pinCode"
                  value={form.pinCode}
                  onChange={handleChange}
                  placeholder="560001"
                  maxLength="6"
                />
              </div>

            </div>

            <div className="address-form-actions">

              <button
                type="button"
                className="cancel-address-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-address-button"
              >
                <Save size={18} />

                {editingId !== null
                  ? "Update Address"
                  : "Save Address"}
              </button>

            </div>

          </form>

        </section>
      )}

      {!showForm &&
        addresses.length === 0 && (
          <section className="addresses-empty">

            <div className="addresses-empty-icon">
              <Home size={42} />
            </div>

            <h2>No delivery addresses</h2>

            <p>
              Add your first address to make
              checkout faster.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="empty-add-address-button"
            >
              <Plus size={18} />
              Add Your First Address
            </button>

          </section>
        )}

      {addresses.length > 0 && (
        <section className="addresses-list">

          <div className="addresses-list-header">

            <div>
              <h2>Saved Addresses</h2>

              <p>
                Choose where you want your
                order delivered.
              </p>
            </div>

            <span className="address-count">
              {addresses.length}
              {addresses.length === 1
                ? " Address"
                : " Addresses"}
            </span>

          </div>

          <div className="address-grid">

            {addresses.map((item) => (

              <article
                className={
                  item.isDefault
                    ? "address-card default-address"
                    : "address-card"
                }
                key={item.id}
              >

                <div className="address-card-header">

                  <div className="address-card-icon">
                    <MapPin size={20} />
                  </div>

                  <div className="address-card-label">
                    <strong>
                      {item.isDefault
                        ? "Default Address"
                        : "Delivery Address"}
                    </strong>
                  </div>

                  {item.isDefault && (
                    <span className="default-badge">
                      <CheckCircle size={14} />
                      Default
                    </span>
                  )}

                </div>

                <div className="address-card-details">

                  <h3>{item.fullName}</h3>

                  <p>{item.address}</p>

                  <p>
                    {item.city}, {item.state}
                    {" - "}
                    {item.pinCode}
                  </p>

                  <p className="address-phone">
                    {item.phone}
                  </p>

                </div>

                <button
                  type="button"
                  className="deliver-address-button"
                  onClick={() =>
                    selectAddress(item)
                  }
                >
                  <Truck size={18} />
                  Deliver Here
                </button>

                <div className="address-card-actions">

                  {!item.isDefault && (
                    <button
                      type="button"
                      className="default-address-button"
                      onClick={() =>
                        setDefaultAddress(
                          item.id
                        )
                      }
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    type="button"
                    className="edit-address-button"
                    onClick={() =>
                      editAddress(item)
                    }
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-address-button"
                    onClick={() =>
                      deleteAddress(item.id)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>
      )}

    </main>
  );
}

export default Addresses;
