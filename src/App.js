import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import HotSnacks from "./components/HotSnacks";
import Beverages from "./components/Beverages";
import Munchies from "./components/Munchies";
import Cart from "./components/Cart";
import Order from "./components/MyOrder";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/hot-snacks" element={<HotSnacks />} /> 
        <Route path="/munchies" element={<Munchies />} /> 
        <Route path="/beverages" element={<Beverages />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
