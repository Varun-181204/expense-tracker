const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transaction must belong to a user"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: "Type must be either 'income' or 'expense'",
      },
      required: [true, "Transaction type is required"],
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance dashboard & filtering queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);