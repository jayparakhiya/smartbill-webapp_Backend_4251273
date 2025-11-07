const BillingEntity = require("../models/BillingEntity");

// Add a new billing entity
const addBillingEntity = async (req, res) => {
  const {
    entity_role,
    company_name,
    contact_person,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    phone_number,
    email,
    gstin,
    notes,
  } = req.body;

  const userId = req.user.id; // Assuming user ID is stored in req.user.id after authentication

  // Validate entity_role
  if (!["billed_by", "billed_to"].includes(entity_role)) {
    return res.status(400).json({ message: "Invalid entity role." });
  }

  if (!company_name) {
    return res.status(400).json({ message: "Company name is required." });
  }

  try {
    const newBillingEntity = new BillingEntity({
      user: userId,
      entity_role,
      company_name,
      contact_person,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      phone_number,
      email,
      gstin,
      notes,
    });

    await newBillingEntity.save();
    res.status(201).json(newBillingEntity);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all billing entities for the logged-in user, optionally filtered by role
const getAllBillingEntities = async (req, res) => {
  const userId = req.user.id;
  const { role } = req.query; // Optional query parameter to filter by role

  const filter = { user: userId };
  if (role) {
    if (!["billed_by", "billed_to"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    filter.entity_role = role;
  }

  try {
    const billingEntities = await BillingEntity.find(filter).sort({
      company_name: 1,
    });
    res.json(billingEntities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get billing entity by ID
const getBillingEntityById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const billingEntity = await BillingEntity.findOne({
      _id: id,
      user: userId,
    });
    if (!billingEntity) {
      return res.status(404).json({ message: "Billing entity not found" });
    }
    res.json(billingEntity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Billing entity not found" });
    }
    res.status(500).send("Server error");
  }
};

// Update billing entity by ID
const updateBillingEntityById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const {
    entity_role,
    company_name,
    contact_person,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    phone_number,
    email,
    gstin,
    notes,
  } = req.body;

  // Validate entity_role if provided
  if (entity_role && !["billed_by", "billed_to"].includes(entity_role)) {
    return res.status(400).json({ message: "Invalid entity role." });
  }

  try {
    const billingEntity = await BillingEntity.findOne({
      _id: id,
      user: userId,
    });
    if (!billingEntity) {
      return res.status(404).json({ message: "Billing entity not found" });
    }

    // Update fields if provided
    if (entity_role) billingEntity.entity_role = entity_role;
    if (company_name) billingEntity.company_name = company_name;
    if (contact_person) billingEntity.contact_person = contact_person;
    if (address_line1) billingEntity.address_line1 = address_line1;
    if (address_line2) billingEntity.address_line2 = address_line2;
    if (city) billingEntity.city = city;
    if (state) billingEntity.state = state;
    if (postal_code) billingEntity.postal_code = postal_code;
    if (country) billingEntity.country = country;
    if (phone_number) billingEntity.phone_number = phone_number;
    if (email) billingEntity.email = email;
    if (gstin) billingEntity.gstin = gstin;
    if (notes) billingEntity.notes = notes;

    await billingEntity.save();
    res.json(billingEntity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Billing entity not found" });
    }
    res.status(500).send("Server error");
  }
};

// Delete billing entity by ID
const deleteBillingEntityById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const billingEntity = await BillingEntity.findOneAndDelete({
      _id: id,
      user: userId,
    });
    if (!billingEntity) {
      return res.status(404).json({ message: "Billing entity not found" });
    }
    res.json({ message: "Billing entity removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Billing entity not found" });
    }
    res.status(500).send("Server error");
  }
};

// Search billing entities by company name (only within the current user's entities)
const searchBillingEntities = async (req, res) => {
  const userId = req.user.id;
  const { query, role } = req.query;

  const filter = { user: userId };
  if (role) {
    if (!["billed_by", "billed_to"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    filter.entity_role = role;
  }

  if (query) {
    filter.company_name = { $regex: query, $options: "i" };
  }

  try {
    const billingEntities = await BillingEntity.find(filter).sort({
      company_name: 1,
    });
    res.json(billingEntities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addBillingEntity,
  getAllBillingEntities,
  getBillingEntityById,
  updateBillingEntityById,
  deleteBillingEntityById,
  searchBillingEntities,
};
