import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2026 Whiteboard App. All rights reserved.</p>

      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/register">Register</Link>
      </div>
    </footer>
  );
};

export default Footer;
