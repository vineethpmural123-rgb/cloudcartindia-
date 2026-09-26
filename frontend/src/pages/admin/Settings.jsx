import React, { useState } from "react";

function Settings() {
  const [storeName, setStoreName] =
    useState("CloudCart");

  const [email, setEmail] =
    useState("admin@cloudcart.com");

  const [currency, setCurrency] =
    useState("INR");

  const [message, setMessage] =
    useState("");

  const handleSave = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "cloudcartSettings",
      JSON.stringify({
        storeName,
        email,
        currency,
      })
    );

    setMessage(
      "Settings saved successfully."
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "36px",
          }}
        >
          Settings
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          Manage your CloudCart store settings.
        </p>
      </div>

      {/* SETTINGS CARD */}

      <div
        style={{
          maxWidth: "800px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          Store Settings
        </h2>

        <p
          style={{
            color: "#64748b",
            marginBottom: "25px",
          }}
        >
          Update basic information about your
          CloudCart store.
        </p>

        {message && (
          <div
            style={{
              padding: "12px 15px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#dcfce7",
              color: "#15803d",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* STORE NAME */}

          <div style={styles.field}>
            <label style={styles.label}>
              Store Name
            </label>

            <input
              type="text"
              value={storeName}
              onChange={(event) =>
                setStoreName(
                  event.target.value
                )
              }
              placeholder="Enter store name"
              style={styles.input}
            />
          </div>

          {/* ADMIN EMAIL */}

          <div style={styles.field}>
            <label style={styles.label}>
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="Enter admin email"
              style={styles.input}
            />
          </div>

          {/* CURRENCY */}

          <div style={styles.field}>
            <label style={styles.label}>
              Currency
            </label>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(
                  event.target.value
                )
              }
              style={styles.input}
            >
              <option value="INR">
                Indian Rupee (₹)
              </option>

              <option value="USD">
                US Dollar ($)
              </option>

              <option value="EUR">
                Euro (€)
              </option>
            </select>
          </div>

          {/* SAVE */}

          <button
            type="submit"
            style={styles.button}
          >
            Save Settings
          </button>
        </form>
      </div>

      {/* SECURITY CARD */}

      <div
        style={{
          maxWidth: "800px",
          marginTop: "25px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          Security
        </h2>

        <p
          style={{
            color: "#64748b",
          }}
        >
          Your CloudCart administrator account
          is protected by authentication.
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            background: "#f8fafc",
            color: "#334155",
          }}
        >
          <strong>
            Admin Access
          </strong>

          <div
            style={{
              marginTop: "5px",
              color: "#15803d",
              fontWeight: "600",
            }}
          >
            Active
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
  },

  button: {
    marginTop: "5px",
    padding: "13px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Settings;
