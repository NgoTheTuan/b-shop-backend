const router = require("express").Router();
const fileUploader = require("../configs/cloudinary.config");

// Upload img
router.post("/", fileUploader.single("file"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  res.json({ success: true, url: req.file.path });
});

module.exports = router;
