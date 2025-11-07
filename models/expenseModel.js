const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    incoming: {
      type: Number,
      required: true,
      min: 0,
    },
    outgoing: {
      type: Number,
      required: true,
      min: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
