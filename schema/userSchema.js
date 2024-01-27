const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = model("User", userSchema);
module.exports = User;
