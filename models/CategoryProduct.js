const mongoose = require("mongoose");

const CategoryProductSchema = new mongoose.Schema(
  {
    categoriesId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      max: 500,
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

module.exports = mongoose.model("CategoryProduct", CategoryProductSchema);
