const router = require("express").Router();
const Supplier = require("../models/Supplier");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    const savedSupplier = await newSupplier.save();

    return res.status(200).json({
      success: true,
      message: "Create Supplier in success",
      data: savedSupplier,
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
    const supplier = await Supplier.findById(req.body.supplierId);
    if (req.body.supplierId === String(supplier._id)) {
      await Supplier.findByIdAndUpdate(req.body.supplierId, {
        $set: req.body,
      });

      const supplierUpdate = await Supplier.findById(req.body.supplierId);

      return res.status(200).json({
        success: true,
        message: "Supplier has been updated",
        data: supplierUpdate,
      });
    } else {
      return res.status(403).json("Can not Supplier");
    }
  } catch (error) {
    return res.status(500).json("Error update News");
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (req.params.id === String(supplier._id)) {
    try {
      await Supplier.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Supplier has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// GET A
router.get("/find/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      return res.status(200).json({
        success: true,
        message: "Get a Supplier in success",
        data: supplier,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Supplier search error" });
  }
});

// GET ALL
router.get("/get-all", async (req, res) => {
  try {
    const supplier = await Supplier.find().sort({
      createdAt: "desc",
    });

    return res.status(200).json({
      success: true,
      message: "Get all supplier",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all supplier" });
  }
});

// GET FILTER
router.post("/filter", async (req, res) => {
  const { companyFilter, status } = req.body;
  try {
    let filter = {};

    if ((status === 1 || status === 0) && companyFilter.trim()) {
      filter = {
        company: new RegExp(companyFilter, "i"),
        status: Number(status),
      };
    } else if (status === 1 || status === 0) {
      filter = {
        status: Number(status),
      };
    } else if (companyFilter.trim()) {
      filter = {
        company: new RegExp(companyFilter, "i"),
      };
    }

    const supplier = await Supplier.find(filter).exec();

    return res.status(200).json({
      success: true,
      message: "Get filter Supplier",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem Supplier" });
  }
});

module.exports = router;
