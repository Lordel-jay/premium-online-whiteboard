const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");

const User = require("./models/user"); 

const app = express();

// CORS config
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});



// REGISTRATION ROUTE (with bcrypt)
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN ROUTE (with bcrypt.compare)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt for:", email);
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid Email or Password" });

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({
        message: "Login Successful",
        token: "fake-jwt-token", // Replace with real JWT in production
        userName: user.username,
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Socket.io: drawing events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/whiteboard_jay")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.io running at http://localhost:${PORT}`);
});