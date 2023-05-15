const router = require("express").Router();
const ProductReview = require("../models/ProductReview");
const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newProductReview = new ProductReview({
      ...req.body,
    });
    const savedProductReview = await newProductReview.save();

    return res.status(200).json({
      success: true,
      message: "Create product review in success",
      data: savedProductReview,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

//CREATE
router.post("/statistics", async (req, res) => {
  try {
    const { productId } = req.body;

    const productReview = await ProductReview.find({ productId: productId });

    const starValues = [1, 2, 3, 4, 5];
    const starCounts = {};
    let starPercent = {};
    let totalPoin = 0;
    for (const starValue of starValues) {
      const count = await ProductReview.countDocuments({
        productId: productId,
        star: starValue,
      });
      starCounts[`value${starValue}`] = count;
    }

    if (Object.keys(starCounts).length >= 5 && productReview?.length) {
      totalPoin =
        (starCounts?.value1 * 1 +
          starCounts?.value2 * 2 +
          starCounts?.value3 * 3 +
          starCounts?.value4 * 4 +
          starCounts?.value5 * 5) /
        (starCounts?.value1 +
          starCounts?.value2 +
          starCounts?.value3 +
          starCounts?.value4 +
          starCounts?.value5);

      starPercent = {
        value1: (Number(starCounts?.value1) / productReview?.length) * 100,
        value2: (Number(starCounts?.value2) / productReview?.length) * 100,
        value3: (Number(starCounts?.value3) / productReview?.length) * 100,
        value4: (Number(starCounts?.value4) / productReview?.length) * 100,
        value5: (Number(starCounts?.value5) / productReview?.length) * 100,
      };
    }

    return res.status(200).json({
      success: true,
      message: "GET ALL product review in success",
      data: productReview,
      star: starCounts,
      totalPercent: starPercent,
      totalPoin: Number(Number(totalPoin).toFixed(1)),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

//CREATE
router.post("/getByProduct", async (req, res) => {
  try {
    const { productId, star } = req.body;
    const query = {};
    if (productId) {
      query.productId = productId;
    }
    if (star) {
      query.star = star;
    }

    const productReview = await ProductReview.find(query).sort({
      createdAt: "desc",
    });
    return res.status(200).json({
      success: true,
      message: "GET ALL product review in success",
      data: productReview,
      res: res.body,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

module.exports = router;
