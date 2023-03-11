const router = require("express").Router();
const fileUploader = require("../configs/cloudinary.config");


// Upload img
router.post(
  "/",
  fileUploader.single("file"),
  (req, res, next) => {
    console.log("update");
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }

    res.json({ secure_url: req.file.path });
  }
);

module.exports = router;
