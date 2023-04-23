const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
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
    categoriesId: {
      type: String,
      required: true,
    },
    supplierId: {
      type: String,
      required: true,
    },
    wareHouseId: {
      type: String,
      required: true,
    },
    quantitySold: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
