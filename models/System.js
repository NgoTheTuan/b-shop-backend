const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema(
  {
    cover_image: {
      type: String,
    },
    section: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("System", SystemSchema);
