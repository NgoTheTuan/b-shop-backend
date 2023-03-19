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

// REGISTER
router.post("/", async (req, res) => {
  try {
    const hashPassword = await argon2.hash(req.body.password);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      avatar: req.body.avatar,
      address: req.body.address,
      phone: req.body.phone,
    });

    const user = await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Register in success",
      data: user,
    });
  } catch (error) {
    res.status(500).json(error);
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

// Change Password

router.post("/change-password", verifyToken, async (req, res) => {
  const { userId, password, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (userId === String(user._id)) {
      const passwordValid = await argon2.verify(user.password, password);
      console.log(passwordValid);
      if (passwordValid) {
        const hashNewPassword = await argon2.hash(newPassword);
        await User.findByIdAndUpdate(userId, {
          $set: {
            password: hashNewPassword,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Change Password succsess",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "incorrect password",
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
});

// GET FILTER USER
router.post("/filter", verifyToken, async (req, res) => {
  const { nameFilter, status } = req.body;
  try {
    let filter = {};

    if ((status === 1 || status === 0) && nameFilter.trim()) {
      filter = {
        username: new RegExp(nameFilter, "i"),
        status: Number(status),
      };
    } else if (status === 1 || status === 0) {
      filter = {
        status: Number(status),
      };
    } else if (nameFilter.trim()) {
      filter = {
        username: new RegExp(nameFilter, "i"),
      };
    }

    const user = await User.find(filter).exec();

    return res.status(200).json({
      success: true,
      message: "Get filter user",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem user" });
  }
});

module.exports = router;
