const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema(
  {
    // Giới thiệu về shop
    section_1: {
      type: String,
    },
    // về chúng tôi
    section_2: {
      type: String,
    },
    // Liên hệ
    section_3: {
      type: String,
    },
    // Thông tin shop
    section_4: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("System", SystemSchema);
