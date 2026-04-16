import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Whiteboard = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    // Safety check
    if (!API_URL) {
      console.error(" VITE_API_URL is missing. Check your Vercel environment variables.");
      return;
    }

    //  Initialize socket safely
    socketRef.current = io(API_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    // Connection events
    socketRef.current.on("connect", () => {
      console.log("Connected to socket:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error(" Socket connection error:", err.message);
    });

    //  Example: listen for drawing updates
    socketRef.current.on("draw", (data) => {
      console.log("📡 Drawing data received:", data);
      // handle drawing logic here
    });

    //  Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Socket disconnected");
      }
    };
  }, []);

  return (
    <div>
      <h2>Whiteboard</h2>
      {/* Your canvas / UI goes here */}
    </div>
  );
};

export default Whiteboard;