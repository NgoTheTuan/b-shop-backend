const router = require("express").Router();
const Product = require("../models/Product");
const CategoryProduct = require("../models/CategoryProduct");
const Supplier = require("../models/Supplier");

const verifyToken = require("../middleware/verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const categoryId = req.body.categoryId;

    const category = await CategoryProduct.findById(categoryId);
    const newProduct = new Product({
      ...req.body,
      categoriesId: category.categoriesId,
    });
    const savedProduct = await newProduct.save();

    return res.status(200).json({
      success: true,
      message: "Create product in success",
      data: savedProduct,
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
    const product = await Product.findById(req.body.productId);
    if (req.body.productId === String(product._id)) {
      const categoryId = req.body.categoryId;

      const category = await CategoryProduct.findById(categoryId);

      await Product.findByIdAndUpdate(req.body.productId, {
        $set: {
          ...req.body,
          categoriesId: category.categoriesId,
        },
      });

      const productUpdate = await Product.findById(req.body.productId);

      return res.status(200).json({
        success: true,
        message: "Product has been updated",
        data: productUpdate,
      });
    } else {
      return res.status(403).json("Can not Product");
    }
  } catch (error) {
    return res.status(500).json("Error update product");
  }
});

// DELETE USER
router.delete("/:id", verifyToken, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (req.params.id === String(product._id)) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Product has been deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cam update only your Account");
  }
});

// GET A PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    let supplier;
    if (product) {
      supplier = await Supplier.findById(product?.supplierId);
    }

    if (product) {
      return res.status(200).json({
        success: true,
        message: "Get a product in success",
        data: {
          ...product?._doc,
          supplier: supplier,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "product search error" });
  }
});

// GET ALL PRODUCT
router.get("/get-all", verifyToken, async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: "desc" });
    return res.status(200).json({
      success: true,
      message: "Get all product",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all product" });
  }
});

// GET ALL PRODUCT FOR if else
router.post("/get-selling", async (req, res) => {
  const {
    selling,
    createdAt,
    price,
    discount,
    name,
    sort,
    limit,
    categoriesId,
    categoryId,
  } = req.body;

  try {
    let sortProduct = {};
    if (selling) {
      sortProduct = {
        ...sortProduct,
        quantitySold: sort || "asc",
      };
    }
    if (createdAt) {
      sortProduct = {
        ...sortProduct,
        createdAt: sort || "asc",
      };
    }
    if (price) {
      sortProduct = {
        ...sortProduct,
        price: sort || "asc",
      };
    }
    if (discount) {
      sortProduct = {
        ...sortProduct,
        discount: sort || "asc",
      };
    }
    if (name) {
      sortProduct = {
        ...sortProduct,
        name: sort || "asc",
      };
    }

    let params = {};
    if (categoriesId) {
      params = {
        categoriesId: categoriesId,
      };
    } else if (categoryId) {
      params = {
        categoryId: categoryId,
      };
    }

    let product;
    if (limit) {
      product = await Product.find(params)
        .sort(sortProduct)
        .limit(limit)
        .exec();
    } else {
      product = await Product.find(params).sort(sortProduct).exec();
    }

    return res.status(200).json({
      success: true,
      message: "Get all product selling",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim get all product" });
  }
});

// GET FILTER PRODUCT
router.post("/filter", async (req, res) => {
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

    const product = await Product.find(filter).exec();

    return res.status(200).json({
      success: true,
      message: "Get filter product",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ mess: "loi tim kiem product" });
  }
});

module.exports = router;
