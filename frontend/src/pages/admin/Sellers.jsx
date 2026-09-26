import React from "react";

function Sellers() {
  const sellers = [
    {
      id: 1,
      name: "Vinee Mural",
      email: "vinee@example.com",
      phone: "9876543210",
      products: 4,
      status: "Active",
    },
    {
      id: 2,
      name: "CloudCart Seller",
      email: "seller@example.com",
      phone: "9876501234",
      products: 8,
      status: "Active",
    },
    {
      id: 3,
      name: "Demo Seller",
      email: "demo@example.com",
      phone: "9876512345",
      products: 3,
      status: "Active",
    },
  ];

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "36px",
            }}
          >
            Sellers
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Manage CloudCart sellers.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={styles.card}>
          <p style={styles.cardTitle}>Total Sellers</p>

          <h2 style={styles.cardValue}>
            {sellers.length}
          </h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Active Sellers</p>

          <h2 style={styles.cardValue}>
            {
              sellers.filter(
                (seller) =>
                  seller.status === "Active"
              ).length
            }
          </h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>
            Total Products
          </p>

          <h2 style={styles.cardValue}>
            {sellers.reduce(
              (total, seller) =>
                total + seller.products,
              0
            )}
          </h2>
        </div>
      </div>

      {/* SELLERS TABLE */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "22px 25px",
            borderBottom:
              "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "22px",
            }}
          >
            Seller List
          </h2>
        </div>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "800px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  textAlign: "left",
                }}
              >
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Seller</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>
                  Products
                </th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id}>
                  <td style={styles.td}>
                    #{seller.id}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {seller.name}
                  </td>

                  <td style={styles.td}>
                    {seller.email}
                  </td>

                  <td style={styles.td}>
                    {seller.phone}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: "#2563eb",
                    }}
                  >
                    {seller.products}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background:
                          "#dcfce7",
                        color: "#15803d",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {seller.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sellers.length === 0 && (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No sellers available.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px",
  },

  cardValue: {
    margin: "12px 0 0",
    color: "#111827",
    fontSize: "32px",
  },

  th: {
    padding: "16px 20px",
    borderBottom:
      "1px solid #e5e7eb",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "700",
  },

  td: {
    padding: "17px 20px",
    borderBottom:
      "1px solid #e5e7eb",
    color: "#475569",
    fontSize: "14px",
  },
};

export default Sellers;
