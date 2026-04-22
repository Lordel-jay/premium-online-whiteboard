import express from "express";
import authMiddleware from "../middleware/auth.js";
//import Board from "../models/Board.js";
import fs from "fs";
console.log("Middleware exists:", fs.existsSync("../middleware/auth.js"));

const router = express.Router();

router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { title, data } = req.body;

    const board = new Board({
      title,
      data,
      createdBy: req.user.id,
    });

    await board.save();
    res.json({ message: "Board saved" });

  } catch (err) {
    res.status(500).json({ message: "Error saving board" });
  }
});

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({ createdBy: req.user.id });
    res.json(boards);

  } catch (err) {
    res.status(500).json({ message: "Error fetching boards" });
  }
});

export default router;