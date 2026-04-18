import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "./models/user.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"]
}));

// ✅ MongoDB (OPTIONAL - keep commented if not running)
/*
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
*/

// ✅ HTTP server
const server = http.createServer(app);

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// ✅ ALL SOCKET LOGIC MUST BE INSIDE HERE
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // DRAW START
  socket.on("draw-start", (data) => {
    socket.broadcast.emit("draw-start", data);
  });

  // DRAW
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  // CHAT
  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", msg);
  });

  // COMMENTS
  socket.on("new-comment", (comment) => {
    socket.broadcast.emit("new-comment", comment);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================= AUTH ROUTES =================

// ✅ Register
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ⚠️ If Mongo is OFF, skip DB logic
    if (!mongoose.connection.readyState) {
      return res.json({ message: "Registered (dummy mode)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login (SAFE even if Mongo OFF)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 FALLBACK (if Mongo not running)
    if (!mongoose.connection.readyState) {
      return res.json({
        token: "dummy-token",
        message: "Login successful (dummy mode)",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      message: "Login successful",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= BASIC ROUTES =================

app.get("/", (req, res) => {
  res.send("Whiteboard backend running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  
});