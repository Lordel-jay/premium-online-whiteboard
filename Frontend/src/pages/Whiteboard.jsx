import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    socketRef.current = io(API_URL, {
      transports: ["websocket"],
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const start = (e) => {
      drawing.current = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);

      socketRef.current.emit("draw-start", { x, y });
    };

    const draw = (e) => {
      if (!drawing.current) return;

      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();

      socketRef.current.emit("draw", { x, y });
    };

    const stop = () => {
      drawing.current = false;
      ctx.beginPath();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);

    socketRef.current.on("draw", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default Whiteboard;