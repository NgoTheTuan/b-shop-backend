const router = require("express").Router();
const User = require("../models/User");
const argon2 = require("argon2");

const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const hashPassword = await argon2.hash(req.body.password);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    const user = await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Register in success",
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email" });
    }

    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "Login in success",
      user,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

module.exports = router;
