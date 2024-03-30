import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Sidebar from "./Sidebar";
import { TbShoppingCartExclamation } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : {};
  });
  const [paymentType, setPaymentType] = useState("official");
  const [mobileNumber, setMobileNumber] = useState("");
  const [expectedTime, setExpectedTime] = useState(0);
  const [prepInstructions, setprepInstructions] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    }
  }, []);

  const updateQuantity = (itemId, quantity) => {
    if (cartItems[itemId]) {
      if (quantity <= 0) {
        removeFromCart(itemId);
      } else {
        setCartItems((prevItems) => {
          const updatedItems = { ...prevItems };
          updatedItems[itemId].quantity = quantity;
          localStorage.setItem("cartItems", JSON.stringify(updatedItems));
          localStorage.setItem(`count_${itemId}`, quantity);
          return updatedItems;
        });
      }
    } else {
      console.error("Item not found in the cart.");
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[itemId];
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      localStorage.removeItem(`count_${itemId}`);
      return updatedItems;
    });
  };

  const totalAmount = Object.values(cartItems).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
  };

  const handlePrepInstructionChange = (event) => {
    setprepInstructions(event.target.value);
  };

  const handleExpectedTimeChange = (event) => {
    const value = event.target.value;
    setExpectedTime(value);
  };

  const handleMobileNumberChange = (event) => {
    const value = event.target.value;
    const newValue = value.replace(/\D/g, '');
    const newValueLimited = newValue.slice(0, 10);
    setMobileNumber(newValueLimited);
  };
  

  const generateOrderId = () => {
    const locationId = localStorage.getItem("selectedLocation");
    const firstLetter = locationId.charAt(0);
    const randomString = Math.random().toString(36).substring(2, 5).toUpperCase();
  
    const now = new Date();
    const ISTTime = new Date(now.getTime());
  
    const year = ISTTime.getFullYear().toString();
    const month = (ISTTime.getMonth() + 1).toString().padStart(2, "0");
    const day = ISTTime.getDate().toString().padStart(2, "0");
    const hours = ISTTime.getHours().toString().padStart(2, "0");
    const minutes = ISTTime.getMinutes().toString().padStart(2, "0");
  
    const orderId = `${firstLetter}${randomString}${year}${month}${day}${hours}${minutes}`;
  
    return orderId;
  };  

  const handlePlaceOrder = () => {
    if (
      !mobileNumber ||
      !paymentType ||
      !expectedTime ||
      !Object.keys(cartItems).length
    ) {
      alert("Please fill all fields before placing the order.");
      return;
    }
    const orderId = generateOrderId();
    const now = new Date();
    const ISTTime = new Date(now.getTime());
    const date_Time = ISTTime.toLocaleString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const orderData = {
      orderId,
      userId: getUserIdFromLocalStorage(),
      data: JSON.stringify({
        cartItems,
      }),
      dateTime: date_Time,
      prepInstructions,
      expectedTime,
      mobileNumber,
      paymentType,
      roomId: localStorage.getItem("selectedMeetingRoom"),
      locationId: localStorage.getItem("selectedLocation"),
      stage: "Pending",
    };

    sendOrderDataToServer(orderData);
  };

  const sendOrderDataToServer = (orderData) => {
    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        if (response.ok) {
          setCartItems({});
          localStorage.removeItem("cartItems");
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("count_")) {
              localStorage.setItem(key, "0");
            }
          }
          navigate("/my-orders");
        } else {
          throw new Error("Failed to place order");
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error.message);
        alert("Failed to place order. Please try again later.");
      });
  };

  const getUserIdFromLocalStorage = () => {
    const userIdString = localStorage.getItem("userId");

    if (userIdString) {
      return parseInt(userIdString);
    }
    return null;
  };

  return (
    <div className="show-box">
      <div className="sidebar-left">
        <Sidebar />
      </div>
      <div className="cart-container">
        {Object.keys(cartItems).length === 0 ? (
          <div className="cart-empty-box">
            <TbShoppingCartExclamation className="icon-cart" />
            <p className="cart-text-empty">Your cart is empty</p>
          </div>
        ) : (
          <div className="cart-box">
            <h2 className="cart-heading">Cart Summary</h2>
            <hr />
            <div className="cart-items">
              <div className="added-items">
                {Object.values(cartItems).map((item, index) => (
                  <div key={index} className="cart-item">
                    <span className="cart-item-name">{item.name}</span>
                    <div className="cart-price-quantity-div">
                      <span className="cart-item-price">₹{item.price}</span>
                      <div className="cart-btn button-toggle-plus-minus">
                        <button
                          onClick={() =>
                            updateQuantity(item.item_id, item.quantity - 1)
                          }
                          className="button-minus"
                        >
                          -
                        </button>
                        <span className="item-quantity">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.item_id, item.quantity + 1)
                          }
                          className="button-plus"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div className="bill-amount">
                  <h3 className="bill-details-heading">Bill Details</h3>
                  <div className="total-amount-box">
                    <span>Total Amount</span>
                    <span>Rs.{totalAmount}</span>
                  </div>
                  <hr />
                </div>

                <div className="payment-mode-box">
                  <h3>Choose Payment Type</h3>
                  <input
                    type="radio"
                    id="official"
                    name="paymentType"
                    value="official"
                    checked={paymentType === "official"}
                    onChange={() => handlePaymentTypeChange("official")}
                  />
                  <label htmlFor="official">Official</label>
                  <br />
                  <input
                    type="radio"
                    id="personal"
                    name="paymentType"
                    value="personal"
                    checked={paymentType === "personal"}
                    onChange={() => handlePaymentTypeChange("personal")}
                  />
                  <label htmlFor="personal">Personal</label>
                  <hr />
                </div>

                <div className="mobile-expected-time-box">
                  <h3>
                    Enter Mobile Number <span style={{ color: "red" }}>*</span>
                  </h3>
                  <input
                    type="text"
                    className="mobile-input"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                  />

                  <h3>Delivery Required Within (in minutes)</h3>
                  <input
                    type="number"
                    className="expected-time-input"
                    onChange={handleExpectedTimeChange}
                    step={5}
                  />

                  <hr />
                </div>
                <div>
                  <input
                    name="prep_instruction"
                    placeholder="Add preparation instruction"
                    className="add-prep"
                    onChange={handlePrepInstructionChange}
                  />
                </div>
                <hr className="hr-down-add-prep" />
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
