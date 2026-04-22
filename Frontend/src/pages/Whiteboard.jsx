import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./whiteboard.css";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const [color, setColor] = useState("#000000");
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState([]);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");

  // ✅ LOGOUT (FIXED POSITION)
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const name = prompt("Enter your name:");
    setUsername(name || "User");

    const API_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000";

    // ✅ SEND TOKEN TO BACKEND
    socketRef.current = io(API_URL, {
      auth: { token },
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    let drawing = false;

    const saveState = () => {
      setHistory((prev) => [...prev, canvas.toDataURL()]);
    };

    const start = (e) => {
      drawing = true;
      saveState();

      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);

      socketRef.current.emit("draw-start", {
        x: e.offsetX,
        y: e.offsetY,
      });
    };

    const draw = (e) => {
      if (!drawing) return;

      const drawColor = isErasing ? "#ffffff" : color;

      ctx.strokeStyle = drawColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      socketRef.current.emit("draw", {
        x: e.offsetX,
        y: e.offsetY,
        color: drawColor,
      });
    };

    const stop = () => {
      drawing = false;
      ctx.beginPath();
    };

    // ✅ ADD EVENTS
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);

    // ✅ SOCKET EVENTS
    socketRef.current.on("draw-start", ({ x, y }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    socketRef.current.on("draw", ({ x, y, color }) => {
      ctx.strokeStyle = color;
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    socketRef.current.on("chat-message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socketRef.current.on("new-comment", (cmt) => {
      setComments((prev) => [...prev, cmt]);
    });

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stop);

      socketRef.current.disconnect();
    };
  }, [color, isErasing]); // dependencies needed for correct drawing behavior

  // CHAT
  const sendMessage = () => {
    if (!message) return;

    const msg = { user: username, text: message };

    socketRef.current.emit("chat-message", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
  };

  // COMMENT
  const addComment = () => {
    if (!comment) return;

    const cmt = { user: username, text: comment };

    socketRef.current.emit("new-comment", cmt);
    setComments((prev) => [...prev, cmt]);
    setComment("");
  };

  // UNDO
  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const last = history[history.length - 1];
    if (!last) return;

    const img = new Image();
    img.src = last;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div className="container">
      <div className="main">

        {/* WHITEBOARD */}
        <div className="whiteboard-section">

          <div className="toolbar">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <button onClick={() => setIsErasing(!isErasing)}>
              {isErasing ? "Draw" : "Eraser"}
            </button>

            <button onClick={undo}>Undo</button>
          </div>

          <canvas ref={canvasRef} className="canvas" />
        </div>

        {/* SIDEBAR */}
        <div className="sidebar">

          {/* CHAT */}
          <div className="section">
            <h3>Chat</h3>
            <div className="box">
              {chat.map((msg, i) => (
                <div key={i}>
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </div>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>

          {/* COMMENTS */}
          <div className="section">
            <h3>Comments</h3>
            <div className="box">
              {comments.map((c, i) => (
                <div key={i}>
                  <strong>{c.user}:</strong> {c.text}
                </div>
              ))}
            </div>

            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={addComment}>Add</button>
          </div>

          {/* LOGOUT */}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

        </div>
      </div>
    </div>
  );
};

export default Whiteboard;