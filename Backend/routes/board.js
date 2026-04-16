const express = require("express");
const router = express.Router();
const Board = require("../models/Board");

router.post("/save", async(req,res)=>{

 const {title,data,createdBy} = req.body;

 const board = new Board({
  title,
  data,
  createdBy
 });

 await board.save();

 res.json({message:"Board saved"});
});


router.get("/all", async(req,res)=>{

 const boards = await Board.find();

 res.json(boards);

});

module.exports = router;