const router = require("express").Router();
const Categories = require("../models/Categories");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCategories = new Categories(req.body);
    const savedCategories = await newCategories.save();

    return res.status(200).json({
      success: true,
      message: "Create Categories in success",
      data: savedCategories,
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
    const categories = await Categories.findById(req.body.categoriesId);
    if (req.body.categoriesId === String(categories._id)) {
      await Categories.findByIdAndUpdate(req.body.categoriesId, {
        $set: req.body,
      });

      const categoriesUpdate = await Categories.findById(req.body.categoriesId);

      return res.status(200).json({
        success: true,
        message: "Categories has been updated",
        data: categoriesUpdate,
      });
    } else {
      return res.status(403).json("Can not Categories");
    }
  } catch (error) {
    return res.status(500).json("Error update Categories");
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const categories = await Categories.findById(req.params.id);

  if (req.params.id === String(categories._id)) {
    try {
      await Categories.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Categories has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Categories");
  }
});

// GET A CATEGORIES
router.get("/find/:id", verifyToken, async (req, res) => {
  try {
    const categories = await Categories.findById(req.params.id);
    if (categories) {
      return res.status(200).json({
        success: true,
        message: "Get a Categories in success",
        data: categories,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "categories search error" });
  }
});

// GET ALL
router.get("/get-all", async (req, res) => {
  try {
    const categories = await Categories.find();
    return res.status(200).json({
      success: true,
      message: "Get all Categories",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all product" });
  }
});

// GET FILTER
router.post("/filter", verifyToken, async (req, res) => {
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

    const categories = await Categories.find(filter).exec();
    return res.status(200).json({
      success: true,
      message: "Get filter Categories",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem Categories" });
  }
});

module.exports = router;
