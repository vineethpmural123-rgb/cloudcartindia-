import React from "react";

function Logs() {
  const logs = [
    {
      id: 1,
      action: "Admin Login",
      user: "Administrator",
      details: "Admin logged into CloudCart",
      time: "Today, 10:30 AM",
      status: "Success",
    },
    {
      id: 2,
      action: "Product Added",
      user: "Administrator",
      details: "New product was added",
      time: "Today, 10:15 AM",
      status: "Success",
    },
    {
      id: 3,
      action: "Order Updated",
      user: "Administrator",
      details: "Order status was updated",
      time: "Today, 09:45 AM",
      status: "Success",
    },
    {
      id: 4,
      action: "Customer Login",
      user: "Customer",
      details: "Customer logged into CloudCart",
      time: "Today, 09:20 AM",
      status: "Success",
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
          gap: "20px",
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
            System Logs
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            View recent activities in CloudCart.
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

      {/* LOG CARD */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "22px 25px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "22px",
            }}
          >
            Recent Activity
          </h2>
        </div>

        {/* TABLE */}

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
              minWidth: "750px",
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
                <th style={styles.th}>Action</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Details</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={styles.td}>
                    #{log.id}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {log.action}
                  </td>

                  <td style={styles.td}>
                    {log.user}
                  </td>

                  <td style={styles.td}>
                    {log.details}
                  </td>

                  <td style={styles.td}>
                    {log.time}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: "#dcfce7",
                        color: "#15803d",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No logs available.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  th: {
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "700",
  },

  td: {
    padding: "17px 20px",
    borderBottom: "1px solid #e5e7eb",
    color: "#475569",
    fontSize: "14px",
  },
};

export default Logs;
