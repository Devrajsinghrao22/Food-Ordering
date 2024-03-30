import React, { useState } from "react";
import "../styles/sidebar.css";
import securelogo from "../images/securelogo.svg";

import { BiCoffeeTogo } from "react-icons/bi";
import { GiChipsBag } from "react-icons/gi";
import { IoMdCart } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { GiHotMeal } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";


const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear(); 
  };

  const menuItem = [
    {
      path: "/hot-snacks",
      name: "Hot Snacks",
      icon: <GiHotMeal />,
    },
    {
      path: "/munchies",
      name: "Munchies",
      icon: <GiChipsBag />,
    },
    {
      path: "/beverages",
      name: "Beverages",
      icon: <BiCoffeeTogo />,
    },
    {
      path: "/cart",
      name: "Cart",
      icon: <IoMdCart />,
    },
    {
      path: "/my-orders",
      name: "My Orders",
      icon: <FaClipboardList/>,
    },
    {
      path: "/landing",
      name: "Logout",
      icon: <TbLogout2 />,
      onClick: handleLogout,
    },
    
  ];

  return (
    <div className="container">
      <div style={{ width: isOpen ? "200px" : "70px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            SemsEat
          </h1>

          <cart onClick={toggle}>
            <img
              src={securelogo}
              alt=""
              style={{ width: "46px", height: "auto" }}
            />
          </cart>
        </div>
        {menuItem.map((item, index) => (
          <div key={index} onClick={item.onClick}>
            <NavLink to={item.path} className="link" activeClassName="active">
              <div>{item.icon}</div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                {item.name}
              </div>
            </NavLink>
          </div>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;