import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Save,
  Edit3,
  CheckCircle,
} from "lucide-react";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Customer",
    email: "",
    phone: "",
  });


  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // ================================
  // LOAD PROFILE
  // ================================
  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem("customerProfile")
    );

    if (savedProfile) {
      setProfile({
        name: savedProfile.name || "Customer",
        email: savedProfile.email || "",
        phone: savedProfile.phone || "",
      });
    }
  }, []);

  // ================================
  // HANDLE INPUT CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  // ================================
  // EDIT PROFILE
  // ================================
  const startEditing = () => {
    setEditing(true);
    setSaved(false);
  };

  // ================================
  // SAVE PROFILE
  // ================================
  const saveProfile = () => {
    localStorage.setItem(
      "customerProfile",
      JSON.stringify(profile)
    );

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // ================================
  // CANCEL EDIT
  // ================================
  const cancelEditing = () => {
    const savedProfile = JSON.parse(
      localStorage.getItem("customerProfile")
    );

    if (savedProfile) {
      setProfile({
        name: savedProfile.name || "Customer",
        email: savedProfile.email || "",
        phone: savedProfile.phone || "",
      });
    } else {
      setProfile({
        name: "Customer",
        email: "",
        phone: "",
      });
    }

    setEditing(false);
    setSaved(false);
  };

  return (
    <main className="profile-page">

   <button
  type="button"
  className="profile-back-link"
  onClick={() => navigate("/customer/products")}
>
  <ArrowLeft size={20} />
  <span>Back to Products</span>
</button>

      {/* ================================
          HEADER
      ================================= */}

      <section className="profile-header">

        <div>
          <span className="profile-label">
            CLOUDCART ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and
            account details.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            className="edit-profile-button"
            onClick={startEditing}
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        )}

      </section>

      {/* ================================
          PROFILE CONTENT
      ================================= */}

      <section className="profile-content">

        {/* ================================
            PROFILE CARD
        ================================= */}

        <div className="profile-card">

          <div className="profile-avatar">
            <User size={45} />
          </div>

          <h2>
            {profile.name || "Customer"}
          </h2>

          <p>
            CloudCart Customer
          </p>

        </div>

        {/* ================================
            PERSONAL INFORMATION
        ================================= */}

        <div className="profile-form-card">

          <div className="profile-form-header">

            <div>
              <h2>Personal Information</h2>

              <p>
                Keep your account information up to date.
              </p>
            </div>

          </div>

          {/* ================================
              FULL NAME
          ================================= */}

          <div className="profile-field">

            <label htmlFor="name">
              Full Name
            </label>

            <div
              className={
                editing
                  ? "profile-input-wrapper editing"
                  : "profile-input-wrapper"
              }
            >

              <User size={19} />

              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your full name"
              />

            </div>

          </div>

          {/* ================================
              EMAIL
          ================================= */}

          <div className="profile-field">

            <label htmlFor="email">
              Email Address
            </label>

            <div
              className={
                editing
                  ? "profile-input-wrapper editing"
                  : "profile-input-wrapper"
              }
            >

              <Mail size={19} />

              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your email"
              />

            </div>

          </div>

          {/* ================================
              PHONE
          ================================= */}

          <div className="profile-field">

            <label htmlFor="phone">
              Phone Number
            </label>

            <div
              className={
                editing
                  ? "profile-input-wrapper editing"
                  : "profile-input-wrapper"
              }
            >

              <Phone size={19} />

              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your phone number"
              />

            </div>

          </div>

          {/* ================================
              ACTION BUTTONS
          ================================= */}

          {editing && (
            <div className="profile-actions">

              <button
                type="button"
                className="cancel-profile-button"
                onClick={cancelEditing}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-profile-button"
                onClick={saveProfile}
              >
                <Save size={18} />
                Save Changes
              </button>

            </div>
          )}

          {/* ================================
              SUCCESS MESSAGE
          ================================= */}

          {saved && (
            <div className="profile-saved-message">

              <CheckCircle size={18} />

              Profile saved successfully.

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default Profile;
