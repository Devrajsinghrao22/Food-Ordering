// import React, { useEffect, useState } from "react";
// import Sidebar from "./Sidebar";
// import "../styles/myorder.css";
// import { useNavigate } from "react-router-dom";
// import { GiKnifeFork } from "react-icons/gi";
// import moment from "moment";

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//     } else {
//       const fetchOrders = async () => {
//         try {
//           const userId = localStorage.getItem("userId");
//           const response = await fetch(
//             `http://localhost:5000/orders/my_orders?user_id=${userId}`
//           );
//           if (response.ok) {
//             let data = await response.json();

//             console.log("Fetched data:", data);

//             data.forEach((order) => {
//               order.parsed_date = moment(
//                 order.date_time,
//                 "DD/MM/YYYY, hh:mm A"
//               ).toDate();
//             });

//             data.sort((a, b) => b.parsed_date - a.parsed_date);
//             setOrders(data);
//           } else {
//             console.error("Failed to fetch orders");
//           }
//         } catch (error) {
//           console.error("Error fetching orders:", error);
//         }
//       };

//       fetchOrders();
//     }
//   }, []);

//   const handleOrderClick = (order) => {
//     setSelectedOrder(order);
//     calculateTotalAmount(order);
//   };

//   const calculateTotalAmount = (order) => {
//     let total = 0;
//     for (const item of Object.values(order.data.cartItems)) {
//       total += item.price * item.quantity;
//     }
//     setTotalAmount(total);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "#f0d24d";
//       case "Cancelled":
//         return "red";
//       case "Completed":
//         return "green";
//       case "Reviewed":
//         return "blue";
//       default:
//         return "black";
//     }
//   };

//   const isCancelEnabled = (order) => {
//     const orderTime = moment(order.date_time, "DD/MM/YYYY, hh:mm A");
//     const currentTime = moment();
//     const differenceInMinutes = currentTime.diff(orderTime, "minutes");
//     return differenceInMinutes < 1;
//   };

//   const handleCancelOrder = (order) => {
//     // Logic to cancel the order
//     console.log("Cancelled order:", order);
//   };

//   return (
//     <div className="show-box">
//       <div className="sidebar-left">
//         <Sidebar />
//       </div>

//       <div className="order-list">
//         <h2 className="order-list-heading" style={{ margin: "21px" }}>
//           Order List
//         </h2>
//         <ul>
//           {orders.map((order) => (
//             <div
//               key={order.order_id}
//               onClick={() => handleOrderClick(order)}
//               className={`order-single-box ${
//                 selectedOrder && selectedOrder.order_id === order.order_id
//                   ? "selected"
//                   : ""
//               }`}
//             >
//               <p>Order ID: {order.order_id}</p>
//               <p>Meeting Room: {order.room_id}</p>
//               <p>
//                 {" "}
//                 Status:{" "}
//                 <span
//                   className="status"
//                   style={{
//                     color: getStatusColor(order.stage),
//                     border: `2px solid ${getStatusColor(order.stage)}`,
//                     borderRadius: "8px",
//                     padding: "3px",
//                     fontSize: "13px",
//                   }}
//                 >
//                   {order.stage}
//                 </span>
//               </p>
              
//             </div>
//           ))}
//         </ul>
//       </div>
//       <div className="my-order-details">
//         {selectedOrder ? (
//           <div className="display-selected-order">
//             <div className="date-time-box">
//               <h2 style={{ margin: "21px" }}>Order Details</h2>
//               <span style={{ paddingRight: "21px" }}>
//                 <b>Ordered On:</b> {selectedOrder.date_time}
//               </span>
//             </div>
//             <div className="order-place-details">
//               <p>
//                 <b>Order ID:</b> {selectedOrder.order_id}
//               </p>
//               <p>
//                 <b>Meeting Room:</b> {selectedOrder.room_id}
//               </p>
//               <p>
//                 <b>Payment Type:</b> {selectedOrder.payment_type}
//               </p>
//             </div>
//             <div className="diplay-item-box">
//               <h3 style={{ margin: "10px 0px" }}>Your Order</h3>
//               {Object.values(selectedOrder.data.cartItems).map(
//                 (item, index) => (
//                   <div key={index} className="diplay-name-myorder">
//                     <span style={{ width: "150px" }}>{item.name}</span>
//                     <div>
//                       <span>x{item.quantity}</span>
//                     </div>
//                     <div>
//                       <span>₹{item.price}</span>
//                     </div>
//                   </div>
//                 )
//               )}
//               <hr style={{ margin: "10px 0px" }} />
//               <div className="amount-box">
//                 <b>Total Amount:</b>
//                 <span>₹{totalAmount}</span>
//               </div>
//             </div>
//             {isCancelEnabled(selectedOrder) && (
//                 <button className="cancel-order-button" onClick={() => handleCancelOrder(selectedOrder)}>Cancel</button>
//               )}
//           </div>
//         ) : (
//           <div className="message-div">
//             <div className="content-msg-div">
//               <GiKnifeFork className="mag-icon-fork" />
//               <p>Please select an order to view the details</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrder;





import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/myorder.css";
import { useNavigate } from "react-router-dom";
import { GiKnifeFork } from "react-icons/gi";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarRating from "./StarRating";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalAmountYourOrder, setTotalAmountYourOrder] = useState(0);
  const [totalAmountUpdatedOrder, setTotalAmountUpdatedOrder] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [notifications, setNotifications] = useState([]);
  // const [flag, setFlag] = useState(false);
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

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        setNotifications([...notifications, data.message]);
        
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    calculateTotalAmountYourOrder(order);
    calculateTotalAmountUpdatedOrder(order);
  };

  const calculateTotalAmountYourOrder = (order) => {
    let total = 0;
    for (const item of Object.values(order.data.cartItems)) {
      total += item.price * item.quantity;
    }
    setTotalAmountYourOrder(total);
  };

  const calculateTotalAmountUpdatedOrder = (order) => {
    let total = 0;
    if (order.data.updatedItems) {
      for (const item of Object.values(order.data.updatedItems)) {
        total += item.price * item.quantity;
      }
    }
    setTotalAmountUpdatedOrder(total);
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
        return "#68184D";
      case "Approved":
        return "#68184D";
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

  const handleCancelOrder = async (order) => {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/${order.order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stage: "Cancellation Requested",
          }),
        }
      );
      if (response.ok) {
        const updatedOrders = orders.map((o) => {
          if (o.order_id === order.order_id) {
            return { ...o, stage: "Cancellation Requested" };
          }
          return o;
        });
        setOrders(updatedOrders);
        setSelectedOrder({ ...order, stage: "Cancellation Requested" });
        toast.success("Order cancelled successfully!", {
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to cancel the order. Please try again later.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel the order. Please try again later.", {
        autoClose: 3000,
      });
    }
  };

  const handleCancelOrderUser = async (order) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/orders/${order.order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stage: "Cancelled",
          }),
        }
      );
      if (response.ok) {
        const updatedOrders = orders.map((o) => {
          if (o.order_id === order.order_id) {
            return { ...o, stage: "Cancelled" };
          }
          return o;
        });
        setOrders(updatedOrders);
        setSelectedOrder({ ...order, stage: "Cancelled" });
        toast.success("Order cancelled successfully!", {
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to cancel the order. Please try again later.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel the order. Please try again later.", {
        autoClose: 3000,
      });
    }
  };

  const handleApproveOrder = async (order) => {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/${order.order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stage: "Approved",
          }),
        }
      );
      if (response.ok) {
        const updatedOrders = orders.map((o) => {
          if (o.order_id === order.order_id) {
            return { ...o, stage: "Approved" };
          }
          return o;
        });
        setOrders(updatedOrders);
        setSelectedOrder({ ...order, stage: "Approved" });
        toast.success("Order approved successfully!", {
          autoClose: 3000,
        });
      } else {
        console.error("Failed to approve the order");
      }
    } catch (error) {
      console.error("Error approving order:", error);
      toast.error("Failed to approve the order. Please try again later.", {
        autoClose: 3000,
      });
    }
  };
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5000/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedOrder.order_id,
          feedback: feedback,
          rating: rating,
        }),
      });
      if (response.ok) {
        toast.success("Feedback submitted successfully!", {
          autoClose: 3000,
        });
      } else {
        console.error("Failed to submit feedback");
        toast.error("Failed to submit feedback. Please try again later.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again later.", {
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="show-box">
      <div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
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
                <span>₹{totalAmountYourOrder}</span>
              </div>
            </div>
            {selectedOrder.data.updatedItems && (
              <div className="diplay-item-box">
                <h3 style={{ margin: "10px 0px" }}>Updated Order - By CSP</h3>
                {Object.values(selectedOrder.data.updatedItems).map(
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
                  <span>₹{totalAmountUpdatedOrder}</span>
                </div>
                {selectedOrder.stage === "Reviewed" && (
                  <div className="button-box-my-order">
                    <button
                      className="approve-order-btn"
                      onClick={() => handleApproveOrder(selectedOrder)}
                    >
                      Approve
                    </button>
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(selectedOrder)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
            {isCancelEnabled(selectedOrder) && (
              <button
                className="cancel-order-button"
                onClick={() => handleCancelOrderUser(selectedOrder)}
              >
                Cancel
              </button>
            )}
            {selectedOrder.stage === "Dispatched" &&
              !selectedOrder.feedback_status && (
                <div className="feedback-section">
                  <textarea
                    style={{padding: '4px', fontSize: '15px'}}
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Enter your feedback"
                    className="feedback-textarea"
                    rows={10}
                    cols={100}
                  ></textarea>
                  <p>Rate our service:</p>
                  <StarRating
                    rating={rating}
                    onRatingChange={handleRatingChange}
                  />
                  <div className="parent-feedback-button">
                  <button
                    className="submit-feedback-btn"
                    onClick={handleSubmitFeedback}
                  >
                    Submit Feedback
                  </button>
                    </div>
                </div>
              )}
            {/* <NotificationComponent notifications={notifications} /> */}
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
