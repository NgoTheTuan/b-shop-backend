const router = require("express").Router();
const CategoryProduct = require("../models/CategoryProduct");
const Categories = require("../models/Categories");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCategoryProduct = new CategoryProduct(req.body);
    const savedCategoryProduct = await newCategoryProduct.save();

    const categories = await Categories.findById(req.body.categoriesId);

    const updateCategoryNumber = await Categories.findByIdAndUpdate(
      req.body.categoriesId,
      {
        $set: {
          categoryProductNumber: categories.categoryProductNumber + 1,
        },
      }
    );

    await updateCategoryNumber.save();

    return res.status(200).json({
      success: true,
      message: "Create Category Product in success",
      data: savedCategoryProduct,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

// GET A CATEGORIES
router.get("/find/:id", async (req, res) => {
  try {
    const category = await CategoryProduct.findById(req.params.id);
    if (category) {
      return res.status(200).json({
        success: true,
        message: "Get a Category in success",
        data: category,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "category search error" });
  }
});

// UPDATE
router.put("/", verifyToken, async (req, res) => {
  try {
    const categoryProduct = await CategoryProduct.findById(
      req.body.categoryProductId
    );
    if (req.body.categoryProductId === String(categoryProduct._id)) {
      await CategoryProduct.findByIdAndUpdate(req.body.categoryProductId, {
        $set: req.body,
      });

      const categoryProductUpdate = await CategoryProduct.findById(
        req.body.categoryProductId
      );

      return res.status(200).json({
        success: true,
        message: "Category Product has been updated",
        data: categoryProductUpdate,
      });
    } else {
      return res.status(403).json("Can not Category Product");
    }
  } catch (error) {
    return res.status(500).json("Error update Category Product");
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const categoryProduct = await CategoryProduct.findById(req.params.id);

  if (req.params.id === String(categoryProduct._id)) {
    try {
      const categories = await Categories.findById(
        categoryProduct.categoriesId
      );

      const updateCategoryNumber = await Categories.findByIdAndUpdate(
        categoryProduct.categoriesId,
        {
          $set: {
            categoryProductNumber: categories.categoryProductNumber - 1,
          },
        }
      );

      await updateCategoryNumber.save();

      await CategoryProduct.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Category Product has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// GET ALL
router.get("/get-all", async (req, res) => {
  try {
    const categoryProduct = await CategoryProduct.find().sort({
      createdAt: "desc",
    });
    return res.status(200).json({
      success: true,
      message: "Get all Category Product",
      data: categoryProduct,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all Category Product" });
  }
});

// GET FILTER
router.post("/filter", async (req, res) => {
  const { titleFilter, status } = req.body;
  try {
    let filter = {};

    if ((status === 1 || status === 0) && titleFilter.trim()) {
      filter = {
        title: new RegExp(titleFilter, "i"),
        status: Number(status),
      };
    } else if (status === 1 || status === 0) {
      filter = {
        status: Number(status),
      };
    } else if (titleFilter.trim()) {
      filter = {
        title: new RegExp(titleFilter, "i"),
      };
    }

    const categoryProduct = await CategoryProduct.find(filter).exec();
    return res.status(200).json({
      success: true,
      message: "Get filter Category Product",
      data: categoryProduct,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem Category Product" });
  }
});

module.exports = router;
