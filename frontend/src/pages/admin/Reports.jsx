import React from "react";

function Reports() {
  const reports = [
    {
      id: 1,
      name: "Sales Report",
      description: "Total sales and revenue",
      value: "₹12,450",
    },
    {
      id: 2,
      name: "Orders Report",
      description: "Total customer orders",
      value: "48 Orders",
    },
    {
      id: 3,
      name: "Products Report",
      description: "Products available in store",
      value: "24 Products",
    },
    {
      id: 4,
      name: "Customers Report",
      description: "Registered customers",
      value: "156 Customers",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
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
              fontSize: "36px",
              color: "#111827",
            }}
          >
            Reports
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            View CloudCart reports and statistics.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                color: "#111827",
              }}
            >
              {report.name}
            </h2>

            <p
              style={{
                color: "#64748b",
              }}
            >
              {report.description}
            </p>

            <h2
              style={{
                color: "#2563eb",
                marginTop: "20px",
              }}
            >
              {report.value}
            </h2>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.06)",
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
            }}
          >
            Available Reports
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "700px",
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
                <th style={styles.th}>Report</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Value</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td style={styles.td}>
                    #{report.id}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {report.name}
                  </td>

                  <td style={styles.td}>
                    {report.description}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: "#2563eb",
                    }}
                  >
                    {report.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default Reports;
