import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

import logo_light from "../../assets/logo-white.png";
import logo_dark from "../../assets/logo-white.png";
import search_icon_light from "../../assets/search-light.png";
import search_icon_dark from "../../assets/search-dark.png";
import toggle_light from "../../assets/sun.png";
import toggle_dark from "../../assets/moon.png";

const Navbar = ({ theme, setTheme }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ FIXED THEME TOGGLE
  const toggle_mode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  // ✅ PROPER LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    navigate("/login"); // redirect properly
  };

  return (
    <div className="navbar">
      <img
        src={theme === "light" ? logo_light : logo_dark}
        alt="logo"
        className="logo"
      />

      <ul>
        <li><Link to="/">Home</Link></li>

        {token && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/whiteboard/test">Whiteboard</Link></li>
          </>
        )}

        {!token && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Registration</Link></li>
          </>
        )}

        {token && (
          <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
            Logout
          </li>
        )}
      </ul>

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <img
          src={theme === "light" ? search_icon_light : search_icon_dark}
          alt="search"
        />
      </div>

      <img
        onClick={toggle_mode}
        src={theme === "light" ? toggle_light : toggle_dark}
        alt="toggle theme"
        className="toggle-icon"
      />
    </div>
  );
};

export default Navbar;