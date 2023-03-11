const mongoose = require("mongoose");

const ProductPaymentSchema = new mongoose.Schema({
  product_id: String,
  product_img: String,
  product_title: String,
  product_price: Number,
  product_total: Number,
});

const PaymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    payment_type: {
      type: String,
      default: "offline",
    },
    products: [ProductPaymentSchema],
    total_money: {
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

module.exports = mongoose.model("Payment", PaymentSchema);

// const PaymentSchema = new mongoose.Schema(
//     {
//       user_id: {
//         type: String,
//         require: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       email: {
//         type: String,
//         required: true,
//       },
//       phone: {
//         type: String,
//         required: true,
//       },
//       adress: {
//         type: String,
//         required: true,
//       },
//       note: {
//         type: String,
//       },
//       payment_type: {
//         type: String,
//         default: "offline",
//       },
//       products: [ProductPaymentSchema],
//       total_money: {
//         type: Number,
//         default: 0,
//       },
//       status: {
//         type: Number,
//         default: 1,
//         required: true,
//       },
//     },
//     { timestamps: true }
//   );
