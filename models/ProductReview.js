const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_avatar: String,
  user_name: String,
});

const ProductReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    user: UserSchema,
    productId: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
