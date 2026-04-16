const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({

 title:String,

 data:Array,

 createdBy:String,

 createdAt:{
  type:Date,
  default:Date.now
 }

});

module.exports = mongoose.model("Board",boardSchema);