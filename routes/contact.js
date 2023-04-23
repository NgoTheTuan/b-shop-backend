const router = require("express").Router();
const Contact = require("../models/Contact");
const verifyToken = require("../middleware/verifyToken");

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
    const contact = await Contact.find().sort({ createdAt: "desc" });
    return res.status(200).json({
      success: true,
      message: "Get all contact",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all contact" });
  }
});

// UPDATE
router.put("/", verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.body.contactId);
    if (req.body.contactId === String(contact._id)) {
      await Contact.findByIdAndUpdate(req.body.contactId, {
        $set: req.body,
      });

      const contactUpdate = await Contact.findById(req.body.contactId);

      return res.status(200).json({
        success: true,
        message: "Contact has been updated",
        data: contactUpdate,
      });
    } else {
      return res.status(403).json("Can not Contact");
    }
  } catch (error) {
    return res.status(500).json("Error update Contact");
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (req.params.id === String(contact._id)) {
    try {
      await Contact.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Contact has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// GET A News
router.get("/find/:id", verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      return res.status(200).json({
        success: true,
        message: "Get a Contact in success",
        data: contact,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Contact search error" });
  }
});

// GET FILTER News
router.post("/filter", verifyToken, async (req, res) => {
  const { emailFilter, status } = req.body;
  try {
    let filter = {};

    if ((status === 1 || status === 0) && emailFilter.trim()) {
      filter = {
        email: new RegExp(emailFilter, "i"),
        status: Number(status),
      };
    } else if (status === 1 || status === 0) {
      filter = {
        status: Number(status),
      };
    } else if (emailFilter.trim()) {
      filter = {
        email: new RegExp(emailFilter, "i"),
      };
    }

    const contact = await Contact.find(filter).exec();
    return res.status(200).json({
      success: true,
      message: "Get filter Contact",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem Contact" });
  }
});

module.exports = router;
