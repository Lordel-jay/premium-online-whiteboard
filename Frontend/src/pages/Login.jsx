import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Use deployed backend URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://premium-online-whiteboard-2.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }));

      if (!res.ok) {
        throw new Error(data.message || `Error: ${res.status}`);
      }

      // ✅ Store user data
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userName",
        data.userName || email.split("@")[0]
      );

      console.log("Login successful");
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);

      // ✅ Better error messages
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please try again in a moment.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          {error && (
            <div className="error-message" style={errorStyle}>
              {error}
            </div>
          )}

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
  textAlign: "center",
};

export default Login;