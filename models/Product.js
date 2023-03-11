const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description:{
        type: String,
        required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
      required: true,
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
