const express = require("express");
const router = express.Router();
const {
  addBillingEntity,
  getAllBillingEntities,
  getBillingEntityById,
  updateBillingEntityById,
  deleteBillingEntityById,
  searchBillingEntities,
} = require("../controller/billingEntityController");
const auth = require("../middleware/authMiddleware");

// @route   POST /api/billing-entities
// @desc    Add a new billing entity

router.post("/", auth, addBillingEntity);

// @route   GET /api/billing-entities
// @desc    Get all billing entities, optionally filtered by role

router.get("/", auth, getAllBillingEntities);

// @route   GET /api/billing-entities/search
// @desc    Search billing entities by company name, optionally filtered by role

router.get("/search", auth, searchBillingEntities);

// @route   GET /api/billing-entities/:id
// @desc    Get a billing entity by ID

router.get("/:id", auth, getBillingEntityById);

// @route   PUT /api/billing-entities/:id
// @desc    Update a billing entity by ID

router.put("/:id", auth, updateBillingEntityById);

// @route   DELETE /api/billing-entities/:id
// @desc    Delete a billing entity by ID
router.delete("/:id", auth, deleteBillingEntityById);

module.exports = router;
