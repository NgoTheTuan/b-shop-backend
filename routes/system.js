const router = require("express").Router();
const System = require("../models/System");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const array = {
    section_1: JSON.stringify({
      header_shop: "Shop mỹ phẩm",
      header_content: "Shop mỹ phẩm xịn xò",
      cover_image: "ảnh bìa",
    }),
    section_2: JSON.stringify({
      introduce: "Giới thiệu",
      content: "cyu raats to",
    }),
    section_3: JSON.stringify({
      shop_name: "SHop",
      shop_time: "123",
      shop_master: "nguyen van a",
      shop_address: "ha noi",
      shop_phone: "0129321093",
      shop_email: "mail@gmail.com",
      shop_map: "13",
    }),
    section_4: JSON.stringify({
      link_facebook: "face",
      link_youtube: "you",
      link_instagram: "in",
      bank: "bank",
      bank_number: "123",
      banh_user: "A",
    }),
  };
  try {
    const newSystem = new System(array);
    const savedSystem = await newSystem.save();

    return res.status(200).json({
      success: true,
      message: "Create System in success",
      data: savedSystem,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  const system = await System.findById(req.params.id);
  if (req.params.id === String(system._id)) {
    try {
      await System.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      const systemUpdate = await System.findById(req.params.id);

      return res.status(200).json({
        success: true,
        message: "systemUpdate has been updated",
        data: systemUpdate,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your systemUpdate");
  }
});

// GET ALL
router.get("/get-all", async (req, res) => {
  try {
    const system = await System.find();
    return res.status(200).json({
      success: true,
      message: "Get all System",
      data: system,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all System" });
  }
});

module.exports = router;
