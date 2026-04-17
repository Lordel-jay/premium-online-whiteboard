require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const socketHandler = require("./socket/socket");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// DB
connectDB();

// Server + Socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

socketHandler(io);

// Port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));