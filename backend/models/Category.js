const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [30, "Category name cannot exceed 30 characters"],
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: [true, "Category type is required (expense or income)"],
      lowercase: true,
    },
    color: {
      type: String,
      default: "#6366F1", // Indigo default
      trim: true,
    },
    icon: {
      type: String,
      default: "Tag",
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate category names for the same user and type
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
