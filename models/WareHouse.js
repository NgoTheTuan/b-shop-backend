const mongoose = require("mongoose");

const WareHouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    storageCapacity: {
      type: Number,
      default: 0,
      required: true,
    },
    email: {
      type: String,
      max: 50,
    },
    address: {
      type: String,
      max: 150,
    },
    phone: {
      type: String,
      max: 50,
      require: true,
    },
    status: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WareHouse", WareHouseSchema);
