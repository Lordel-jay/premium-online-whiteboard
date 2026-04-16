import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect("mongodb://127.0.0.1:27017/whiteboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ================= MODELS =================
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" } // admin or user
});

const BoardSchema = new mongoose.Schema({
  title: String,
  users: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Board = mongoose.model("Board", BoardSchema);

// ================= AUTH =================
const SECRET = "secret123";

app.post("/api/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET);
  res.json({ token, user });
});

// ================= USERS =================
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

// ================= BOARDS =================
app.post("/api/boards", async (req, res) => {
  const board = await Board.create(req.body);
  res.json(board);
});

app.get("/api/boards", async (req, res) => {
  const boards = await Board.find();
  res.json(boards);
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/whiteboardDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const UserSchema = new mongoose.Schema({
  username: String,
  isOnline: Boolean,
  lastActive: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
// ================= START =================
app.listen(5000, () => console.log("Server running on port 5000"));