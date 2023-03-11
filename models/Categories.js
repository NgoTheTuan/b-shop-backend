const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      max: 500,
      required: true,
    },
    categoryProductNumber: {
      type: Number,
      default: 0,
    },
    status: {
        type: Number,
        default: 1,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", CategoriesSchema);
