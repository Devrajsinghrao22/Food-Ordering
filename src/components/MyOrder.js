import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/myorder.css";
import { useNavigate } from "react-router-dom";
import { GiKnifeFork } from "react-icons/gi";
import moment from "moment";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      const fetchOrders = async () => {
        try {
          const userId = localStorage.getItem("userId");
          const response = await fetch(
            `http://localhost:5000/orders/my_orders?user_id=${userId}`
          );
          if (response.ok) {
            let data = await response.json();

            console.log("Fetched data:", data);

            data.forEach((order) => {
              order.parsed_date = moment(
                order.date_time,
                "DD/MM/YYYY, hh:mm A"
              ).toDate();
            });

            data.sort((a, b) => b.parsed_date - a.parsed_date);
            setOrders(data);
          } else {
            console.error("Failed to fetch orders");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    calculateTotalAmount(order);
  };

  const calculateTotalAmount = (order) => {
    let total = 0;
    for (const item of Object.values(order.data.cartItems)) {
      total += item.price * item.quantity;
    }
    setTotalAmount(total);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f0d24d";
      case "Cancelled":
        return "red";
      case "Completed":
        return "green";
      case "Reviewed":
        return "blue";
      default:
        return "black";
    }
  };

  const isCancelEnabled = (order) => {
    const orderTime = moment(order.date_time, "DD/MM/YYYY, hh:mm A");
    const currentTime = moment();
    const differenceInMinutes = currentTime.diff(orderTime, "minutes");
    return differenceInMinutes < 1;
  };

  const handleCancelOrder = (order) => {
    // Logic to cancel the order
    console.log("Cancelled order:", order);
  };

  return (
    <div className="show-box">
      <div className="sidebar-left">
        <Sidebar />
      </div>

      <div className="order-list">
        <h2 className="order-list-heading" style={{ margin: "21px" }}>
          Order List
        </h2>
        <ul>
          {orders.map((order) => (
            <div
              key={order.order_id}
              onClick={() => handleOrderClick(order)}
              className={`order-single-box ${
                selectedOrder && selectedOrder.order_id === order.order_id
                  ? "selected"
                  : ""
              }`}
            >
              <p>Order ID: {order.order_id}</p>
              <p>Meeting Room: {order.room_id}</p>
              <p>
                {" "}
                Status:{" "}
                <span
                  className="status"
                  style={{
                    color: getStatusColor(order.stage),
                    border: `2px solid ${getStatusColor(order.stage)}`,
                    borderRadius: "8px",
                    padding: "3px",
                    fontSize: "13px",
                  }}
                >
                  {order.stage}
                </span>
              </p>
              
            </div>
          ))}
        </ul>
      </div>
      <div className="my-order-details">
        {selectedOrder ? (
          <div className="display-selected-order">
            <div className="date-time-box">
              <h2 style={{ margin: "21px" }}>Order Details</h2>
              <span style={{ paddingRight: "21px" }}>
                <b>Ordered On:</b> {selectedOrder.date_time}
              </span>
            </div>
            <div className="order-place-details">
              <p>
                <b>Order ID:</b> {selectedOrder.order_id}
              </p>
              <p>
                <b>Meeting Room:</b> {selectedOrder.room_id}
              </p>
              <p>
                <b>Payment Type:</b> {selectedOrder.payment_type}
              </p>
            </div>
            <div className="diplay-item-box">
              <h3 style={{ margin: "10px 0px" }}>Your Order</h3>
              {Object.values(selectedOrder.data.cartItems).map(
                (item, index) => (
                  <div key={index} className="diplay-name-myorder">
                    <span style={{ width: "150px" }}>{item.name}</span>
                    <div>
                      <span>x{item.quantity}</span>
                    </div>
                    <div>
                      <span>₹{item.price}</span>
                    </div>
                  </div>
                )
              )}
              <hr style={{ margin: "10px 0px" }} />
              <div className="amount-box">
                <b>Total Amount:</b>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            {isCancelEnabled(selectedOrder) && (
                <button className="cancel-order-button" onClick={() => handleCancelOrder(selectedOrder)}>Cancel</button>
              )}
          </div>
        ) : (
          <div className="message-div">
            <div className="content-msg-div">
              <GiKnifeFork className="mag-icon-fork" />
              <p>Please select an order to view the details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
