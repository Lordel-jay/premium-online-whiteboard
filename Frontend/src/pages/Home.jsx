import React from 'react';
import { Link } from 'react-router-dom'; // Added this
import "./Home.css"; // Ensure your original CSS is linked

export default function Home() {
  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="title">Whiteboard</h1>
        <p className="subtitle">Collaborate in real-time with your team.</p>
        
        <div className="buttons">
          {/* Change your Get Started button to this Link */}
          <Link to="/login">
            <button className="neon-btn">Get Started</button>
          </Link>
          
          <Link to="/register">
            <button className="neon-btn secondary">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}