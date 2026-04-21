import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/user.js"; // ✅ FIXED

dotenv.config();

const app = express();
app.use(express.json());

// ✅ FIXED CORS (IMPORTANT)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://premium-online-whiteboard-w9es-8hgj1kdpe-lordel-jays-projects.vercel.app"
  ],
  credentials: true
}));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// HTTP server
const server = http.createServer(app);

// ✅ FIXED Socket.IO CORS
const io = new Server(server, {
  cors: {
origin: [
  "http://localhost:5173",
  "https://premium-online-whiteboard-w9es-8hgj1kdpe-lordel-jays-projects.vercel.app"
] ,
    methods: ["GET", "POST"],
  },
});

// SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("draw-start", (data) => {
    socket.broadcast.emit("draw-start", data);
  });

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", msg);
  });

  socket.on("new-comment", (comment) => {
    socket.broadcast.emit("new-comment", comment);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================= AUTH =================

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!mongoose.connection.readyState) {
      return res.json({ message: "Registered (dummy mode)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({   // ✅ renamed
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!mongoose.connection.readyState) {
      return res.json({
        token: "dummy-token",
        message: "Login successful (dummy mode)",
      });
    }

    const foundUser = await User.findOne({ email }); // ✅ renamed
    if (!foundUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: foundUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      message: "Login successful",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ROUTES =================

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