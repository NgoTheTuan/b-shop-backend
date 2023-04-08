const router = require("express").Router();
const News = require("../models/News");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newNews = new News(req.body);
    const savedNews = await newNews.save();

    return res.status(200).json({
      success: true,
      message: "Create News in success",
      data: savedNews,
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
    const news = await News.findById(req.body.newsId);
    if (req.body.newsId === String(news._id)) {
      await News.findByIdAndUpdate(req.body.newsId, {
        $set: req.body,
      });

      const newsUpdate = await News.findById(req.body.newsId);

      return res.status(200).json({
        success: true,
        message: "News has been updated",
        data: newsUpdate,
      });
    } else {
      return res.status(403).json("Can not News");
    }
  } catch (error) {
    return res.status(500).json("Error update News");
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const news = await News.findById(req.params.id);

  if (req.params.id === String(news._id)) {
    try {
      await News.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "News has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// GET A News
router.get("/find/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      return res.status(200).json({
        success: true,
        message: "Get a News in success",
        data: news,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "News search error" });
  }
});

// GET ALL News
router.get("/get-all", async (req, res) => {
  const { limit } = req.query;
  try {
    let news;
    if (limit) {
      news = await News.find()
        .sort({
          createdAt: "desc",
        })
        .limit(4);
    } else {
      news = await News.find();
    }

    return res.status(200).json({
      success: true,
      message: "Get all News",
      data: news,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all News" });
  }
});

// GET FILTER News
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

    const news = await News.find(filter).exec();
    return res.status(200).json({
      success: true,
      message: "Get filter News",
      data: news,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem News" });
  }
});

module.exports = router;
