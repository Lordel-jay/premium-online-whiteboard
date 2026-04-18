import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import React, { useEffect, useState } from "react";

// Components & Pages
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Whiteboard from "./pages/Whiteboard";
import Home from "./pages/Home";

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // If no token, kick them back to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("current_theme") || "light");

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} />

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Public Routes: Anyone can see these */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes: Only for logged-in users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/whiteboard/:id" 
            element={
              <ProtectedRoute>
                <Whiteboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/whiteboard" 
            element={
              <ProtectedRoute>
                <Whiteboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all: redirect any weird URL to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

