const mongoose = require("mongoose");

const BillingEntitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    entity_role: {
      type: String,
      enum: ["billed_by", "billed_to"],
      required: true,
    },
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    contact_person: {
      type: String,
      trim: true,
    },
    address_line1: {
      type: String,
      trim: true,
    },
    address_line2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postal_code: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    gstin: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // Correctly closing the schema options
);

// Exclude `__v` from the output
BillingEntitySchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("BillingEntity", BillingEntitySchema);
