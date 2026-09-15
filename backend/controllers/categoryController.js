const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const { seedDefaultCategories } = require("../utils/defaultCategories");

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find({ user: req.user._id }).sort({ type: 1, name: 1 });

    // Auto-seed if user has no categories yet
    if (categories.length === 0) {
      await seedDefaultCategories(req.user._id);
      categories = await Category.find({ user: req.user._id }).sort({ type: 1, name: 1 });
    }

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new custom category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Category name and type (expense/income) are required" });
    }

    const normalizedType = type.toLowerCase().trim();
    if (!["expense", "income"].includes(normalizedType)) {
      return res.status(400).json({ message: "Type must be either 'expense' or 'income'" });
    }

    // Check for duplicate category name for this user & type
    const existing = await Category.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      type: normalizedType,
    });

    if (existing) {
      return res.status(400).json({ message: `A ${normalizedType} category named "${name}" already exists` });
    }

    const category = await Category.create({
      user: req.user._id,
      name: name.trim(),
      type: normalizedType,
      color: color || (normalizedType === "income" ? "#10B981" : "#6366F1"),
      icon: icon || "Tag",
      isDefault: false,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this category" });
    }

    const { name, color, icon } = req.body;

    if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const duplicate = await Category.findOne({
        user: req.user._id,
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        type: category.type,
        _id: { $ne: category._id },
      });

      if (duplicate) {
        return res.status(400).json({ message: `A ${category.type} category named "${name}" already exists` });
      }

      // If category name changed, update all existing transactions with the old category name
      const oldName = category.name;
      category.name = name.trim();
      await Transaction.updateMany(
        { user: req.user._id, category: oldName },
        { category: category.name }
      );
    }

    if (color) category.color = color;
    if (icon) category.icon = icon;

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this category" });
    }

    // Check if there are transactions associated with this category
    const transactionCount = await Transaction.countDocuments({
      user: req.user._id,
      category: category.name,
    });

    if (transactionCount > 0) {
      // Reassign transactions to "Other"
      await Transaction.updateMany(
        { user: req.user._id, category: category.name },
        { category: "Other" }
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: `Category "${category.name}" deleted successfully`,
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
