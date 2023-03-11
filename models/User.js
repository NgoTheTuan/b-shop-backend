const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      max: 150,
      default: "",
    },
    phone: {
      type: String,
      max: 50,
      default: "",
    },
    status: {
      type: Number,
      default: 1,
      required: true,
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
