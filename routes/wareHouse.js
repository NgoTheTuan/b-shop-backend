const router = require("express").Router();
const WareHouse = require("../models/WareHouse");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newWareHouse = new WareHouse(req.body);
    const savedWareHouse = await newWareHouse.save();

    return res.status(200).json({
      success: true,
      message: "Create WareHouse in success",
      data: savedWareHouse,
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
    const wareHouse = await WareHouse.findById(req.body.wareHouseId);
    if (req.body.wareHouseId === String(wareHouse._id)) {
      await WareHouse.findByIdAndUpdate(req.body.wareHouseId, {
        $set: req.body,
      });

      const wareHouseUpdate = await WareHouse.findById(req.body.wareHouseId);

      return res.status(200).json({
        success: true,
        message: "WareHouse has been updated",
        data: wareHouseUpdate,
      });
    } else {
      return res.status(403).json("Can not WareHouse");
    }
  } catch (error) {
    return res.status(500).json("Error update WareHouse");
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const wareHouse = await WareHouse.findById(req.params.id);

  if (req.params.id === String(wareHouse._id)) {
    try {
      await WareHouse.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "WareHouse has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only WareHouse");
  }
});

// GET A WareHouse
router.get("/find/:id", async (req, res) => {
  try {
    const wareHouse = await WareHouse.findById(req.params.id);
    if (wareHouse) {
      return res.status(200).json({
        success: true,
        message: "Get a WareHouse in success",
        data: wareHouse,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "WareHouse search error" });
  }
});

// GET ALL News
router.get("/get-all", async (req, res) => {
  try {
    let wareHouse = await WareHouse.find().sort({
      createdAt: "desc",
    });

    return res.status(200).json({
      success: true,
      message: "Get all WareHouse",
      data: wareHouse,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all WareHouse" });
  }
});

// GET FILTER News
router.post("/filter", verifyToken, async (req, res) => {
  const { nameFilter, status } = req.body;
  try {
    let filter = {};

    if ((status === 1 || status === 0) && nameFilter.trim()) {
      filter = {
        name: new RegExp(nameFilter, "i"),
        status: Number(status),
      };
    } else if (status === 1 || status === 0) {
      filter = {
        status: Number(status),
      };
    } else if (nameFilter.trim()) {
      filter = {
        name: new RegExp(nameFilter, "i"),
      };
    }

    const wareHouse = await WareHouse.find(filter).exec();
    return res.status(200).json({
      success: true,
      message: "Get filter WareHouse",
      data: wareHouse,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem WareHouse" });
  }
});

// GET A SUPPLIER CHANGE storageCapacity
router.post("/quantity", async (req, res) => {
  const { wareHouseId, quantity } = req.body;

  try {
    const getWareHouse = await WareHouse.findById(wareHouseId);

    if (quantity + getWareHouse?.quantity > getWareHouse?.storageCapacity) {
      return res.status(200).json({
        success: false,
        message: `Số lượng sản phẩm nhập vào vượt quá giới hạn chứa của kho, kho còn trống ${
          getWareHouse?.storageCapacity - getWareHouse?.quantity
        }`,
        data: {
          storageCapacity: getWareHouse?.storageCapacity,
          quantity: getWareHouse?.quantity,
        },
      });
    }

    const wareHouse = await WareHouse.findByIdAndUpdate(wareHouseId, {
      $inc: {
        quantity: quantity,
      },
    });
    if (wareHouse) {
      return res.status(200).json({
        success: true,
        message: "Change quantity success",
        data: wareHouse,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "WareHouse change error" });
  }
});

module.exports = router;
