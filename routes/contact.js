const router = require("express").Router();
const Contact = require("../models/Contact");

//CREATE
router.post("/", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();

    return res.status(200).json({
      success: true,
      message: "Create Contact in success",
      data: savedContact,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorss" });
  }
});

// GET ALL
router.get("/get-all", async (req, res) => {
  try {
    const contact = await Contact.find();
    return res.status(200).json({
      success: true,
      message: "Get all contact",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all contact" });
  }
});

module.exports = router;
