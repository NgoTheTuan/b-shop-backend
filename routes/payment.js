const router = require("express").Router();
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const WareHouse = require("../models/WareHouse");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    const savedPayment = await newPayment.save();

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

      if (req.body.status === 1) {
        if (paymentUpdate.products.length > 0) {
          paymentUpdate?.products?.forEach(async (product) => {
            await Product.findByIdAndUpdate(product?.product_id, {
              $inc: {
                quantitySold: product?.product_total,
                quantity: -product?.product_total,
              },
            });

            await WareHouse.findByIdAndUpdate(product?.product_wareHouseId, {
              $inc: {
                quantity: -product?.product_total,
              },
            });
          });
        }
      }

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

// GET Payment latest
router.get("/get-latest", verifyToken, async (req, res) => {
  try {
    const payment = await Payment.find({ status: 1 })
      .sort({ createdAt: "desc" })
      .limit(4);
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

// sales statistics
router.get("/sales-statistics", verifyToken, async (req, res) => {
  try {
    const payment = await Payment.find({ status: 1 });

    let totalMoney = 0;
    let totalProduct = 0;
    let totalUser = 0;
    const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let totalMonth = [];

    let currentDate = new Date();

    let day = [];
    for (let i = 0; i < 10; i++) {
      let date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      let dateObj = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
      day.push(dateObj);
    }
    let totalDay = [];
    let totalStatus = {
      pending: 0,
      paid: 0,
      failed: 0,
    };
    if (payment.length > 0) {
      payment.forEach((item) => {
        totalMoney += item.total_money;
        if (item?.products.length > 0) {
          item?.products.forEach((itemProduct) => {
            totalProduct += itemProduct?.product_total;
          });
        }
      });

      const uniqueUserIds = new Set(payment.map((obj) => obj?.user_id));
      totalUser = uniqueUserIds.size;

      month.forEach((item, index) => {
        let total = 0;
        payment.forEach((itemPayment) => {
          const dateTimeString = itemPayment?.updatedAt;
          const dateObj = new Date(dateTimeString);
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;

          let dateTimeNow = new Date();
          let yearNow = dateTimeNow.getFullYear();
          if (yearNow === year && month === item) {
            total = total + Number(itemPayment?.total_money);
          }
        });
        totalMonth[index] = total;
      });

      payment.forEach((itemPayment) => {
        if (itemPayment?.status === 0) {
          totalStatus.paid = totalStatus.pending + 1;
        } else if (itemPayment?.status === 1) {
          totalStatus.paid = totalStatus.paid + 1;
        } else if (itemPayment?.status === 2) {
          totalStatus.paid = totalStatus.failed + 1;
        }
      });

      day.forEach((item, index) => {
        let total = 0;
        payment.forEach((itemPayment) => {
          const dateTimeString = itemPayment?.updatedAt;
          const dateObj = new Date(dateTimeString);
          const day = dateObj.getDate();
          const month = dateObj.getMonth() + 1;
          const year = dateObj.getFullYear();
          if (
            Number(day) === Number(item?.day) &&
            Number(month) === Number(item?.month) &&
            Number(year) === Number(item?.year)
          ) {
            total = total + Number(itemPayment?.total_money);
          }
        });

        totalDay[index] = {
          total,
          date: item?.day + "/" + item?.month,
        };
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get all Payment",
      data: {
        data: payment,
        totalMoney,
        totalProduct,
        totalUser,
        totalMonth,
        totalStatus,
        totalDay: totalDay.reverse(),
        totalOrder: payment.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all Payment" });
  }
});

router.get("/sales-statistics-status", verifyToken, async (req, res) => {
  try {
    const payment = await Payment.find();
    let totalStatus = {
      pending: 0,
      paid: 0,
      failed: 0,
    };
    if (payment.length > 0) {
      payment.forEach((itemPayment) => {
        if (Number(itemPayment?.status) === 0) {
          totalStatus.pending = totalStatus.pending + 1;
        } else if (Number(itemPayment?.status) === 1) {
          totalStatus.paid = totalStatus.paid + 1;
        } else if (Number(itemPayment?.status) === 2) {
          totalStatus.failed = totalStatus.failed + 1;
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get all Payment",
      data: {
        totalStatus,
        totalOrder: payment.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all Payment" });
  }
});

module.exports = router;
