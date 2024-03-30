import React, { useEffect, useState } from "react";
import "../styles/items.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const AddButton = ({ itemId, itemName, itemPrice, addToCart }) => {
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem(`count_${itemId}`);
    return storedCount ? parseInt(storedCount) : 0;
  });

  const handleAdd = () => {
    const newCount = count + 1;
    setCount(newCount);
    addToCart(itemId, itemName, itemPrice);
    localStorage.setItem(`count_${itemId}`, newCount.toString());
  };

  const handleMinus = () => {
    const newCount = count > 1 ? count - 1 : 0;
    setCount(newCount);
    addToCart(itemId, itemName, itemPrice, -1);
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
          <button onClick={handleMinus} className="button-minus">-</button>
          <span>{count}</span>
          <button onClick={handleAdd} className="button-plus">+</button>
        </div>
      ) : (
        <button onClick={handleAdd} className="add-button">Add</button>
      )}
    </>
  );
};

const Munchies = () => {
  const [munchies, setMunchies] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : {};
  });
  const navigate = useNavigate();

  useEffect(() => {
   const token = localStorage.getItem('token');
   if(!token){
    navigate('/');
   }
   else{
    const fetchMunchies = async () => {
      try {
        const selectedLocation = localStorage.getItem("selectedLocation");
        const response = await fetch(
          `http://localhost:5000/munchies/munchies?location=${selectedLocation}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMunchies(data);
      } catch (error) {
        console.error("Error fetching Munchies:", error);
      }
    };

    fetchMunchies();
   }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "cartItems") {
        setCartItems(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addToCart = (itemId, itemName, itemPrice, quantityChange = 1) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const existingItem = updatedItems[itemId];
      const newQuantity = (existingItem ? existingItem.quantity : 0) + quantityChange;

      if (newQuantity <= 0) {
        delete updatedItems[itemId];
      } else {
        updatedItems[itemId] = {
          item_id: itemId,
          name: itemName,
          price: itemPrice,
          quantity: newQuantity,
        };
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });

    const storedCount = localStorage.getItem(`count_${itemId}`);
    const count = storedCount ? parseInt(storedCount) : 0;
    localStorage.setItem(`count_${itemId}`, (count + quantityChange).toString());
  };

  return (
    <div className="show-box">
      <div className="sidebar-left">
        <Sidebar />
      </div>

      <div className="content">
        <h2 className="item-page-heading">Munchies</h2>
        <div className="items-container">
          {munchies.map((item) => (
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

export default Munchies;
