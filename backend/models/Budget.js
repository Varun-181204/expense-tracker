const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0, "Budget amount cannot be negative"],
    },
    category: {
      type: String,
      default: "Overall",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one budget per user/month/year/category
budgetSchema.index({ user: 1, month: 1, year: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);