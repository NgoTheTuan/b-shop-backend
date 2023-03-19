const router = require("express").Router();
const System = require("../models/System");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const array = {
    cover_image:
      "https://res.cloudinary.com/dmrhenlws/image/upload/v1678896005/slider_1_vgohjt.jpg",
    section: JSON.stringify({
      shop_title:
        "B Shop được thành lập với niềm đam mê và khát vọng thành công trong lĩnh vực Thương mại điện tử.",
      shop_address: "Tầng 6, 266 Đội Cấn, Ba Đình, Hà Nội, Hà Nội,",
      shop_phone: "1900675",
      shop_email: "bshop@gmail.com",
      shop_map:
        '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1107172239604!2d105.7886473147633!3d21.02825548599871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4ee3d2b0f7%3A0x5ae05f0cc5533cd8!2zQ8O0bmcgdmnDqm4gQ-G6p3UgR2nhuqV5!5e0!3m2!1svi!2s!4v1678895457346!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
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
