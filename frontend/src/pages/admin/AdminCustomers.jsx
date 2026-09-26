import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";

import "./AdminCustomers.css";

function AdminCustomers() {

  const [customers, setCustomers] =
    useState([]);

  // =========================================
  // LOAD CUSTOMERS
  // =========================================

 useEffect(() => {

  const loadCustomers = async () => {

    try {

    const token =
  localStorage.getItem("adminToken") ||
  localStorage.getItem("token");

      if (!token) {
        console.error(
          "Admin token not found"
        );
        return;
      }

      const response =
        await fetch(
          "/api/admin/customers",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "CUSTOMERS RESPONSE:",
        response.status,
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {

        console.error(
          "Failed to load customers:",
          data
        );

        setCustomers([]);
        return;
      }

      const customerList =
        Array.isArray(data.customers)
          ? data.customers
          : [];

      const formattedCustomers =
        customerList.map(
          (customer) => ({
            ...customer,

            customerId:
              `CUS-${customer.id}`,

            orderCount:
              Number(
                customer.totalOrders || 0
              ),

            totalSpent:
              Number(
                customer.totalSpent || 0
              ),
          })
        );

      console.log(
        "FINAL CUSTOMER DATA:",
        formattedCustomers
      );

      setCustomers(
        formattedCustomers
      );

    } catch (error) {

      console.error(
        "Load customers error:",
        error
      );

      setCustomers([]);

    }

  };

  loadCustomers();

}, []);


  // =========================================
  // CUSTOMER STATS
  // =========================================

  const totalCustomers =
    customers.length;

  const totalOrders =
    customers.reduce(
      (total, customer) =>
        total +
        Number(
          customer.orderCount || 0
        ),
      0
    );

  const totalRevenue =
    customers.reduce(
      (total, customer) =>
        total +
        Number(
          customer.totalSpent || 0
        ),
      0
    );


  return (

    <main className="admin-customers-page">

      {/* BACK */}

      <Link
        to="/admin/dashboard"
        className="admin-customers-back"
      >
        <ArrowLeft size={19} />
        Back to Dashboard
      </Link>


      {/* HEADER */}

      <section className="admin-customers-header">

        <div>

          <span className="admin-customers-label">
            CLOUDCART ADMIN
          </span>

          <h1>
            Customers
          </h1>

          <p>
            View customer accounts and
            purchase activity.
          </p>

        </div>

        <div className="admin-customers-icon">
          <Users size={30} />
        </div>

      </section>


      {/* SUMMARY */}

      <section className="customer-summary">

        {/* TOTAL CUSTOMERS */}

        <div className="customer-summary-card">

          <div className="customer-summary-icon blue">
            <Users size={21} />
          </div>

          <div>

            <span>
              Total Customers
            </span>

            <strong>
              {totalCustomers}
            </strong>

          </div>

        </div>


        {/* TOTAL ORDERS */}

        <div className="customer-summary-card">

          <div className="customer-summary-icon green">
            <ShoppingBag size={21} />
          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

          </div>

        </div>


        {/* TOTAL REVENUE */}

        <div className="customer-summary-card">

          <div className="customer-summary-icon orange">
            <IndianRupee size={21} />
          </div>

          <div>

            <span>
              Customer Revenue
            </span>

            <strong>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

      </section>


      {/* CUSTOMER TABLE */}

      <section className="admin-customers-card">

        <div className="admin-customers-card-header">

          <div>

            <h2>
              Customer Accounts
            </h2>

            <p>
              Registered CloudCart customers.
            </p>

          </div>

        </div>


        {customers.length === 0 ? (

          <div className="admin-customers-empty">

            <Users size={50} />

            <h3>
              No customers yet
            </h3>

            <p>
              Registered customers will
              appear here.
            </p>

          </div>

        ) : (

          <div className="customers-table-wrapper">

            <table className="customers-table">

              <thead>

                <tr>

                  <th>Customer</th>

                  <th>Contact</th>

                  <th>Orders</th>

                  <th>Total Spent</th>

                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {customers.map(
                  (customer, index) => (

                    <tr
                      key={
                        customer.id ||
                        index
                      }
                    >

                      {/* CUSTOMER */}

                      <td>

                        <div className="customer-main">

                          <div className="customer-avatar">
                            <User size={19} />
                          </div>

                          <div>

                            <strong>
                              {customer.name ||
                                "Customer"}
                            </strong>

                            <span>
                              {
                                customer.customerId
                              }
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* CONTACT */}

                      <td>

                        <div className="customer-contact">

                          <span>

                            <Mail size={14} />

                            {customer.email ||
                              "No email"}

                          </span>

                          <span>

                            <Phone size={14} />

                            {customer.phone ||
                              "No phone"}

                          </span>

                        </div>

                      </td>


                      {/* ORDERS */}

                      <td>

                        <span className="customer-orders-count">

                          <ShoppingBag
                            size={15}
                          />

                          {
                            customer.orderCount
                          }

                        </span>

                      </td>


                      {/* TOTAL SPENT */}

                      <td>

                        <strong className="customer-spent">

                          ₹
                          {Number(
                            customer.totalSpent || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span className="customer-status">

                          {
                            customer.status ||
                            "Active"
                          }

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>

  );

}

export default AdminCustomers;



