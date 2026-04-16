import React, { useState } from "react";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    
    try {
      const response = fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
     
      
      const data = await response.json();

      if (response.ok) {
        // Save both token and username
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.userName || email.split('@')[0]);
        
        // Better UX: Use React Router or state management instead of window.location
        window.location.href = "/dashboard"; 
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Fetch error details:", error);
      setError("Cannot connect to server. Check if backend is running on port 5000.");
    } finally {
      setLoading(false);
    }

if (response.ok) {
  localStorage.setItem('token', data.token);
  const nameToSave = data.userName || email.split('@')[0];
  localStorage.setItem('userName', nameToSave);
  window.location.href = "/dashboard";
}
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          
          {error && (
            <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>
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

export default Login;