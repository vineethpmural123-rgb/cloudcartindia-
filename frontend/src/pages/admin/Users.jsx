import React from "react";

function Users() {
  const users = [
    {
      id: 1,
      name: "Vinee Mural",
      email: "vinee@example.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: 2,
      name: "CloudCart Admin",
      email: "admin@cloudcart.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 3,
      name: "Demo Customer",
      email: "customer@example.com",
      role: "Customer",
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
            Users
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Manage CloudCart users and accounts.
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

      {/* SUMMARY CARDS */}

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
          <p style={styles.cardTitle}>
            Total Users
          </p>

          <h2 style={styles.cardValue}>
            {users.length}
          </h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>
            Customers
          </p>

          <h2 style={styles.cardValue}>
            {
              users.filter(
                (user) =>
                  user.role === "Customer"
              ).length
            }
          </h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>
            Active Users
          </p>

          <h2 style={styles.cardValue}>
            {
              users.filter(
                (user) =>
                  user.status === "Active"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* USERS TABLE */}

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
            User List
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
                <th style={styles.th}>
                  ID
                </th>

                <th style={styles.th}>
                  Name
                </th>

                <th style={styles.th}>
                  Email
                </th>

                <th style={styles.th}>
                  Role
                </th>

                <th style={styles.th}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>
                    #{user.id}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {user.name}
                  </td>

                  <td style={styles.td}>
                    {user.email}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background:
                          user.role === "Admin"
                            ? "#dbeafe"
                            : "#f1f5f9",
                        color:
                          user.role === "Admin"
                            ? "#1d4ed8"
                            : "#475569",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background:
                          "#dcfce7",
                        color:
                          "#15803d",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No users available.
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

export default Users;
