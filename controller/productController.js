const Product = require("../models/Product");

// Add a new product
const addProduct = async (req, res) => {
  const { name, description, hsnCode,gst, price, quantity, dynamicFields } =
    req.body;
  const userId = req.user.id; // Assuming user ID is stored in req.user.id after authentication

  try {
    const newProduct = new Product({
      name,
      description,
      hsnCode,gst,
      price,
      quantity,
      dynamicFields: dynamicFields || {}, // Add dynamicFields to the product
      user: userId,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const bulkAddProducts = async (req, res) => {
  const { products } = req.body;
  const userId = req.user.id;

  try {
    const bulkProducts = products.map((product) => ({
      ...product,
      user: userId, 
      dynamicFields: product.dynamicFields || {}, 
    }));

    await Product.insertMany(bulkProducts);
    res.status(201).json({ message: "Products added successfully" });
  } catch (err) {
    console.error("Bulk insert error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  const userId = req.user.id;
  try {
    const products = await Product.find({ user: userId });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// Update product by ID
const updateProductById = async (req, res) => {
  const { name, description, price, hsnCode,gst, quantity, dynamicFields } =
    req.body; // Include dynamicFields in the destructure

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        hsnCode,gst,
        price,
        quantity,
        dynamicFields: dynamicFields || {},
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// Delete product by ID
const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// Search products by name (only within the current user's products)
const searchProducts = async (req, res) => {
  const userId = req.user.id;
  try {
    const { query } = req.query;
    const products = await Product.find({
      user: userId,
      name: { $regex: query, $options: "i" },
    });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const addDynamicField = async (req, res) => {
  const { fieldName, fieldValue } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findOne({ _id: req.params.id, user: userId });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    // Add or update the dynamic field
    product.dynamicFields.set(fieldName, fieldValue);
    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  addProduct,
  bulkAddProducts,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchProducts,
  addDynamicField,
};
