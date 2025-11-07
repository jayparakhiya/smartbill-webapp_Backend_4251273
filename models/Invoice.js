const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    biller: {
      name: String,
      address: String,
      phoneNumber: String,
      email: String,
      gstin: String,
    },
    client: {
      name: String,
      address: String,
      phoneNumber: String,
      email: String,
      gstin: String,
    },
    items: [
      {
        name: String,
        hsnCode: String,
        gst: Number,
        invoiceQuantity: Number,
        price: Number,
        cgst: Number,
        sgst: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    gst: {
      cgst: Number,
      sgst: Number,
    },
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
