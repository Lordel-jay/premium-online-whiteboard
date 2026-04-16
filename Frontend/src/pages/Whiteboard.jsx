import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
});

export default function Whiteboard() {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const prevPos = useRef({ x: 0, y: 0 });

  // Get user name from localStorage (assuming you saved it during login)
  const userName = localStorage.getItem("userName") || "Guest";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) socket.emit("join-room", id);

    const canvas = canvasRef.current;
    canvas.width = 850; // Slightly smaller to fit layout
    canvas.height = 450;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    socket.on("draw", (data) => drawLine(data));
    socket.on("chat-message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("draw");
      socket.off("chat-message");
    };
  }, [id]);

  const drawLine = ({ x0, y0, x1, y1 }) => {
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  const startDrawing = (e) => {
    drawingRef.current = true;
    prevPos.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const draw = (e) => {
    if (!drawingRef.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const drawData = { x0: prevPos.current.x, y0: prevPos.current.y, x1: x, y1: y, room: id };
    drawLine(drawData);
    socket.emit("draw", drawData);
    prevPos.current = { x, y };
  };

  const sendMessage = () => {
    const fullMsg = { user: userName, text: input };
    socket.emit("chat-message", { ...fullMsg, room: id });
    setMessages([...messages, fullMsg]);
    setInput("");
  };

  const addComment = async () => {
    const newComment = { user: userName, text: commentText, boardId: id };
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      });
      const data = await res.json();
      setComments((prev) => [...prev, data]);
    } catch (err) {
      setComments((prev) => [...prev, newComment]); // Fallback
    }
    setCommentText("");
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px", justifyContent: "center" }}>
      {/* Drawing Area */}
      <div style={{ flex: "1", minWidth: "600px" }}>
        <h3 style={{ color: "#333" }}>Board ID: {id}</h3>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={() => (drawingRef.current = false)}
          onMouseLeave={() => (drawingRef.current = false)}
          style={{ border: "3px solid #2E8B57", background: "white", borderRadius: "10px" }}
        />
      </div>

      {/* Sidebar for Chat & Comments */}
      <div style={{ width: "350px", display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* Chat Box */}
        <div className="whiteboard-card" style={{ background: "rgba(255,255,255,0.2)", padding: "15px", borderRadius: "10px", border: "1px solid #2E8B57" }}>
          <h3>Live Chat</h3>
          <div style={{ height: "150px", overflowY: "auto", marginBottom: "10px", background: "white", padding: "5px" }}>
            {messages.map((m, i) => (
              <p key={i} style={{ fontSize: "14px", borderBottom: "1px solid #eee" }}>
                <strong style={{ color: "#2E8B57" }}>{m.user}:</strong> {m.text}
              </p>
            ))}
          </div>
          <textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ width: "100%", height: "50px", borderRadius: "5px", padding: "5px" }}
          />
          <button onClick={sendMessage} style={{ width: "100%", marginTop: "5px", cursor: "pointer", background: "#2E8B57", color: "white", border: "none", padding: "8px" }}>Send Message</button>
        </div>

        {/* Comment Box */}
        <div className="whiteboard-card" style={{ background: "rgba(255,255,255,0.2)", padding: "15px", borderRadius: "10px", border: "1px solid #2E8B57" }}>
          <h3>Board Comments</h3>
          <div style={{ height: "150px", overflowY: "auto", marginBottom: "10px", background: "white", padding: "5px" }}>
            {comments.map((c, i) => (
              <p key={i} style={{ fontSize: "14px", borderBottom: "1px solid #eee" }}>
                <strong style={{ color: "#4CAF50" }}>{c.user}:</strong> {c.text}
              </p>
            ))}
          </div>
          <textarea 
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a permanent comment..."
            style={{ width: "100%", height: "50px", borderRadius: "5px", padding: "5px" }}
          />
          <button onClick={addComment} style={{ width: "100%", marginTop: "5px", cursor: "pointer", background: "#4CAF50", color: "white", border: "none", padding: "8px" }}>Post Comment</button>
        </div>
      </div>
    </div>
  );

  
}