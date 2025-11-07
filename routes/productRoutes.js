const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchProducts,
  addDynamicField,
  addBulkProducts,
  bulkAddProducts,
} = require("../controller/productController");
const auth = require("../middleware/authMiddleware");

// Add a new product
router.post("/add", auth, addProduct);
router.post("/bulk-add", auth, bulkAddProducts);

// Search product by name
router.get("/search", auth, searchProducts);

// Get all products
router.get("/all", auth, getAllProducts);

router.put("/dynamic-field/:id", auth, addDynamicField);

// Get product by ID
router.get("/:id", auth, getProductById);

// Update product by ID
router.put("/:id", auth, updateProductById);

// Delete product by ID
router.delete("/:id", auth, deleteProductById);

module.exports = router;
