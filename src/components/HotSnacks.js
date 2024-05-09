import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/items.css";
import Sidebar from "./Sidebar";

const AddButton = ({ itemId, itemName, itemPrice, itemType, addToCart }) => {
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem(`count_${itemId}`);
    return storedCount ? parseInt(storedCount) : 0;
  });

  const handleAdd = () => {
    const newCount = count + 1;
    setCount(newCount);
    addToCart(itemId, itemName, itemPrice, itemType);
    localStorage.setItem(`count_${itemId}`, newCount.toString());
  };

  const handleMinus = () => {
    const newCount = count > 1 ? count - 1 : 0;
    setCount(newCount);
    addToCart(itemId, itemName, itemPrice, itemType, -1);
    localStorage.setItem(`count_${itemId}`, newCount.toString());
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === `count_${itemId}`) {
        setCount(parseInt(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [itemId]);

  return (
    <>
      {count > 0 ? (
        <div className="button-toggle-plus-minus">
          <button onClick={handleMinus} className="button-minus">
            -
          </button>
          <span>{count}</span>
          <button onClick={handleAdd} className="button-plus">
            +
          </button>
        </div>
      ) : (
        <button onClick={handleAdd} className="add-button">
          Add
        </button>
      )}
    </>
  );
};



const HotSnacks = () => {
  const [hotsnacks, setHotsnacks] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : {};
  });
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      const fetchHotSnacks = async () => {
        try {
          const selectedLocation = localStorage.getItem("selectedLocation");
          const response = await fetch(
            `http://localhost:5000/hot-snacks?location=${selectedLocation}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setHotsnacks(data);
        } catch (error) {
          console.error("Error fetching Hot-Snacks:", error);
        }
      };
      fetchHotSnacks();
    }
  }, []);

  useEffect(() => {
    setHotsnacks((prevHotsnacks) =>
      prevHotsnacks.map((item) => ({
        ...item,
        quantity: cartItems[item.item_id]
          ? cartItems[item.item_id].quantity
          : 0,
      }))
    );
  }, [cartItems]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addToCart = (itemId, itemName, itemPrice, itemType, quantity = 1) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const existingItem = updatedItems[itemId];
      const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

      if (newQuantity <= 0) {
        delete updatedItems[itemId];
      } else {
        updatedItems[itemId] = {
          item_id: itemId,
          name: itemName,
          price: itemPrice,
          quantity: newQuantity,
          type: itemType
        };
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
    localStorage.setItem(`count_${itemId}`, quantity);
  };

  return (
    <div className="show-box">
      <div className="sidebar-left">
        <Sidebar />
      </div>

      <div>
        {/* <h2 className="item-page-heading">Today's Hot Snacks</h2> */}
        <h2 className="item-page-heading">Hot Snacks</h2>
        <div className="items-container">
          {hotsnacks.map((item) => (
            <div key={item.item_id} className="item">
              <img src={item.image} alt={item.name} className="item-image" />
              <h3 className="item-name">{item.name}</h3>
              <hr />
              <div className="price-add-box">
                <b className="price">₹{item.price}</b>
                <AddButton
                  itemId={item.item_id}
                  itemName={item.name}
                  itemPrice={item.price}
                  itemType={item.type_for_item}
                  addToCart={addToCart}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotSnacks;
