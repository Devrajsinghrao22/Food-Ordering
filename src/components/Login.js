import React, { useState } from "react";
import "../styles/userLogin.css";
import Logo from "../images/SecureBirdLogo.png";
import FormHeadImg from "../images/FormHeadImg.png";
import frontend_icon from '../images/frontend_icon.webp';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user_id);
        navigate("/landing");
      } else {
        const data = await response.json();
        showErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      showErrorMessage("Invalid Credentials");
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <>
      <div className="user-logo">
        {/* <img src={Logo} alt="" /> */}
        {/* <img src={frontend_icon} alt="" /> */}

      </div>
      <div className="user-login-form">
        <ToastContainer />

        <div className="user-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <img src={FormHeadImg} alt="" />
            <h2>Welcome</h2>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              style={{borderRadius: '5px'}}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              style={{borderRadius: '5px'}}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">
              {loading ? "Authenticating..." : "Submit"}
            </button>
          </form>
        </div>
        <div className="user-footer">
          <h2>Let Us Serve You</h2>
        </div>
      </div>
    </>
  );
};

export default Login;
