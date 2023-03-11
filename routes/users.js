const router = require("express").Router();
const User = require("../models/User");
const argon2 = require("argon2");

const verifyToken = require("../middleware/verifyToken");

// UPDATE USER
router.put("/", verifyToken, async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (req.body.userId === String(user._id)) {
    if (req.body.password) {
      try {
        req.body.password = await argon2.hash(req.body.password);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      await User.findByIdAndUpdate(req.body.userId, {
        $set: req.body,
      });

      const userUpdate = await User.findById(req.body.userId);

      return res.status(200).json({
        success: true,
        message: "Account has been updated",
        data: userUpdate,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// DELETE USER
router.delete("/:id", verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (req.params.id === String(user._id)) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Account has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// GET A USER
router.get("/find/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: "Get a user in success",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "user search error" });
  }
});

// GET ALL USER
router.get("/get-all", verifyToken, async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json({
      success: true,
      message: "Get all user",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all user" });
  }
});

module.exports = router;
