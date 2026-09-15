const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// Helper to get start and end Date for a given month and year
const getMonthRange = (month, year) => {
  const m = Number(month) || new Date().getMonth() + 1;
  const y = Number(year) || new Date().getFullYear();
  const startDate = new Date(y, m - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);
  return { startDate, endDate, month: m, year: y };
};

// @desc    Get budget overview & comparison for a specific month and year
// @route   GET /api/budget
// @access  Private
const getBudgetSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const { startDate, endDate, month: m, year: y } = getMonthRange(month, year);

    // 1. Fetch overall budget
    const overallBudget = await Budget.findOne({
      user: req.user._id,
      month: m,
      year: y,
      category: "Overall",
    });

    // 2. Fetch category budgets
    const categoryBudgets = await Budget.find({
      user: req.user._id,
      month: m,
      year: y,
      category: { $ne: "Overall" },
    });

    // 3. Aggregate all expenses for this month
    const expensesByCategory = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalExpense = expensesByCategory.reduce((sum, item) => sum + item.totalSpent, 0);
    const overallAmount = overallBudget ? overallBudget.amount : 0;
    const overallRemaining = overallAmount - totalExpense;
    const overallPercentage = overallAmount > 0 ? Math.round((totalExpense / overallAmount) * 100) : 0;

    let overallStatus = "no_budget";
    if (overallAmount > 0) {
      if (overallPercentage >= 100) overallStatus = "exceeded";
      else if (overallPercentage >= 80) overallStatus = "warning";
      else overallStatus = "normal";
    }

    // Map category budgets with their spent amounts
    const spentMap = {};
    expensesByCategory.forEach((exp) => {
      spentMap[exp._id] = exp.totalSpent;
    });

    const categoryBreakdown = categoryBudgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      const remaining = b.amount - spent;
      const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
      let status = "normal";
      if (percentage >= 100) status = "exceeded";
      else if (percentage >= 80) status = "warning";

      return {
        _id: b._id,
        category: b.category,
        budget: b.amount,
        spent,
        remaining,
        percentage,
        status,
        isOverBudget: spent > b.amount,
      };
    });

    res.status(200).json({
      month: m,
      year: y,
      overall: {
        _id: overallBudget ? overallBudget._id : null,
        budget: overallAmount,
        spent: totalExpense,
        remaining: overallRemaining,
        percentage: overallPercentage,
        status: overallStatus,
        isOverBudget: overallAmount > 0 && totalExpense > overallAmount,
      },
      categories: categoryBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update overall budget
// @route   POST /api/budget
// @access  Private
const setOverallBudget = async (req, res, next) => {
  try {
    const { month, year, amount } = req.body;

    if (amount === undefined || amount === null || Number(amount) < 0) {
      return res.status(400).json({ message: "Please provide a valid budget amount (0 or positive number)" });
    }

    const m = Number(month) || new Date().getMonth() + 1;
    const y = Number(year) || new Date().getFullYear();
    const numAmount = Number(amount);

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        month: m,
        year: y,
        category: "Overall",
      },
      {
        user: req.user._id,
        month: m,
        year: y,
        category: "Overall",
        amount: numAmount,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Monthly overall budget saved successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update a category-specific budget
// @route   POST /api/budget/category
// @access  Private
const setCategoryBudget = async (req, res, next) => {
  try {
    const { month, year, amount, category } = req.body;

    if (!category || category.trim() === "Overall") {
      return res.status(400).json({ message: "Please provide a valid category name" });
    }

    if (amount === undefined || amount === null || Number(amount) < 0) {
      return res.status(400).json({ message: "Please provide a valid positive budget amount" });
    }

    const m = Number(month) || new Date().getMonth() + 1;
    const y = Number(year) || new Date().getFullYear();

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        month: m,
        year: y,
        category: category.trim(),
      },
      {
        user: req.user._id,
        month: m,
        year: y,
        category: category.trim(),
        amount: Number(amount),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: `Budget for "${category}" saved successfully`,
      budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budget/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this budget" });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Budget deleted successfully", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgetSummary,
  setOverallBudget,
  setCategoryBudget,
  deleteBudget,
};