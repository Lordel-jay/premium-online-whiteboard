import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [boardId, setBoardId] = useState("");

  const createBoard = () => {
    // Generates a random ID like 'a7b2d'
    const id = Math.random().toString(36).substring(7);
    // Fixed: Using lowercase 'whiteboard' to match App.jsx route
    navigate(`/Whiteboard/${id}`);
  };

  const joinBoard = () => {
    if (boardId.trim() !== "") {
      // Fixed: Using lowercase 'whiteboard' to match App.jsx route
      navigate(`/Whiteboard/${boardId.trim()}`);
    } else {
      alert("Please enter a valid Board ID");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="action-cards">
        <button className="create-btn" onClick={createBoard}>
          Create Whiteboard
        </button>

        <div className="join-section">
          <h3>Join Board</h3>
          <div className="join-box">
            <input
              type="text"
              placeholder="Enter Board ID"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
            />
            <button className="join-btn" onClick={joinBoard}>
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;