import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

await mongoose.connect(MONGODB_URI);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  users: [{ type: String }],
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
const Board = mongoose.model("Board", BoardSchema);

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already in use" });

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const token = createToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const token = createToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
});

app.get("/api/users", auth, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

app.delete("/api/users/:id", auth, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

app.post("/api/boards", auth, async (req, res) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      users: req.body.users || []
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ msg: "Board creation failed", error: err.message });
  }
});

app.get("/api/boards", auth, async (req, res) => {
  const boards = await Board.find();
  res.json(boards);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});