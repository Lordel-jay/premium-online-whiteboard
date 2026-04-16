import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

import logo_light from "../../assets/logo-white.png";
import logo_dark from "../../assets/logo-white.png";
import search_icon_light from "../../assets/search-light.png";
import search_icon_dark from "../../assets/search-dark.png";
import toggle_light from "../../assets/sun.png";
import toggle_dark from "../../assets/moon.png";

const Navbar = ({ theme, setTheme }) => {
  const toggle_mode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");

    const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  window.location.href = "/";
};

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
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/whiteboard/test">Whiteboard</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Registration</Link></li>
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
