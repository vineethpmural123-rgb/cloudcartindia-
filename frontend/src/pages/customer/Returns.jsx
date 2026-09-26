import React from "react";

function Returns() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            color: "#2563eb",
            marginBottom: "10px",
          }}
        >
          Returns & Refunds
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "18px",
          }}
        >
          Manage your product returns and refund requests.
        </p>

        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <h2>Return an Order</h2>

          <p>
            Select an order from your orders page to
            request a return.
          </p>

          <button
            onClick={() => {
              window.location.href =
                "/customer/orders";
            }}
            style={{
              marginTop: "15px",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default Returns;
