import React from "react";

function Payments() {
  const payments = [
    {
      id: 1,
      order: "#1001",
      customer: "Vinee Mural",
      amount: "₹47",
      method: "Cash on Delivery",
      status: "Paid",
      date: "Today",
    },
    {
      id: 2,
      order: "#1002",
      customer: "Customer One",
      amount: "₹1,299",
      method: "UPI",
      status: "Paid",
      date: "Today",
    },
    {
      id: 3,
      order: "#1003",
      customer: "Customer Two",
      amount: "₹799",
      method: "Credit Card",
      status: "Pending",
      date: "Yesterday",
    },
    {
      id: 4,
      order: "#1004",
      customer: "Customer Three",
      amount: "₹2,499",
      method: "UPI",
      status: "Paid",
      date: "Yesterday",
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
            Payments
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            View and manage CloudCart payments.
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
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={styles.card}>
          <p style={styles.cardTitle}>
            Total Payments
          </p>

          <h2 style={styles.cardValue}>
            ₹4,644
          </h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>
            Successful
          </p>

          <h2 style={styles.cardValue}>
            3
          </h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>
            Pending
          </p>

          <h2 style={styles.cardValue}>
            1
          </h2>
        </div>
      </div>

      {/* PAYMENT TABLE */}

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
            Recent Payments
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
              minWidth: "800px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  textAlign: "left",
                }}
              >
                <th style={styles.th}>
                  ID
                </th>

                <th style={styles.th}>
                  Order
                </th>

                <th style={styles.th}>
                  Customer
                </th>

                <th style={styles.th}>
                  Amount
                </th>

                <th style={styles.th}>
                  Method
                </th>

                <th style={styles.th}>
                  Date
                </th>

                <th style={styles.th}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td style={styles.td}>
                    #{payment.id}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {payment.order}
                  </td>

                  <td style={styles.td}>
                    {payment.customer}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                    }}
                  >
                    {payment.amount}
                  </td>

                  <td style={styles.td}>
                    {payment.method}
                  </td>

                  <td style={styles.td}>
                    {payment.date}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background:
                          payment.status === "Paid"
                            ? "#dcfce7"
                            : "#fef3c7",
                        color:
                          payment.status === "Paid"
                            ? "#15803d"
                            : "#b45309",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No payments available.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px",
  },

  cardValue: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#2563eb",
    fontSize: "30px",
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

export default Payments;
