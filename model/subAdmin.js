const mongoose = require("mongoose");
const { type } = require("os");

const subAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role:{
    type:String,
    required:false,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SubAdmin", subAdminSchema);
