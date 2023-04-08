const router = require("express").Router();
const Payment = require("../models/Payment");
const Product = require("../models/Product");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    const savedPayment = await newPayment.save();
    if (savedPayment) {
      if (req.body.products.length > 0) {
        req.body.products.forEach(async (product) => {
          await Product.findByIdAndUpdate(product?.product_id, {
            $inc: {
              quantitySold: product?.product_total,
            },
          });
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Create Payment in success",
      data: savedPayment,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

// UPDATE
router.put("/", verifyToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.body.paymentId);

    if (req.body.paymentId === String(payment._id)) {
      await Payment.findByIdAndUpdate(req.body.paymentId, {
        $set: req.body,
      });

      const paymentUpdate = await Payment.findById(req.body.paymentId);

      return res.status(200).json({
        success: true,
        message: "Payment has been updated",
        data: paymentUpdate,
      });
    } else {
      return res.status(403).json("Can not Payment");
    }
  } catch (error) {
    return res.status(500).json("Error update Payment");
  }
});

// DELETE U
router.delete("/:id", verifyToken, async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (req.params.id === String(payment._id)) {
    try {
      await Payment.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Payment has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// GET A Payment
router.get("/find/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (payment) {
      return res.status(200).json({
        success: true,
        message: "Get a Payment in success",
        data: payment,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Payment search error" });
  }
});

// GET Payment by USER ID
router.get("/user-find/:id", async (req, res) => {
  try {
    const payment = await Payment.find({ user_id: req.params.id }).sort({
      status: "asc",
      createdAt: "desc",
    });
    if (payment) {
      return res.status(200).json({
        success: true,
        message: "Get Payment by USER ID in success",
        data: payment,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Payment search error" });
  }
});

// GET ALL Payment
router.get("/get-all", verifyToken, async (req, res) => {
  try {
    const payment = await Payment.find().sort({ status: "asc" });
    return res.status(200).json({
      success: true,
      message: "Get all Payment",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all Payment" });
  }
});

// GET FILTER PRODUCT
router.post("/filter", verifyToken, async (req, res) => {
  const { nameFilter, status } = req.body;
  try {
    let filter = {};

    if ((status === 1 || status === 0 || status === 2) && nameFilter.trim()) {
      filter = {
        name: new RegExp(nameFilter, "i"),
        status: Number(status),
      };
    } else if (status === 1 || status === 0 || status === 2) {
      filter = {
        status: Number(status),
      };
    } else if (nameFilter.trim()) {
      filter = {
        name: new RegExp(nameFilter, "i"),
      };
    }

    const payment = await Payment.find(filter).exec();

    return res.status(200).json({
      success: true,
      message: "Get filter payment",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem payment" });
  }
});

module.exports = router;
