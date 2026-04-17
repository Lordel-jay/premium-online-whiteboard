import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Get the response data
      const data = await res.json().catch(() => ({ message: "Server sent invalid response" }));

      if (!res.ok) {
        // If the server sent a message, use it; otherwise, default to a generic error
        throw new Error(data.message || `Error: ${res.status}`);
      }

      // Success Logic
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.userName || email.split("@")[0]);
      
      console.log("Login successful, navigating...");
      navigate("/dashboard");

    } catch (err) {
      console.error("Frontend Login Error:", err.message);
      setError(err.message.includes("Failed to fetch") 
        ? "Cannot connect to server. Is the backend running on port 5000?" 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <div className="error-message" style={errorStyle}>{error}</div>}
          
          <div className="input-box">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-box">
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const errorStyle = {
  color: "white",
  backgroundColor: "#ff4d4d",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "1rem",
  fontSize: "14px",
  textAlign: "center"
};

export default Login;