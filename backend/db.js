const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
});

const bankSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  balance: Number,
});

const Bank = mongoose.model("Bank", bankSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  Bank,
};
