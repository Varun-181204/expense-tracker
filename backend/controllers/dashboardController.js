const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const mongoose = require("mongoose");

// @desc    Get dashboard metrics with real MongoDB data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    // 1. All-time Totals
    const allTimeData = await Transaction.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransactions = 0;

    allTimeData.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
      totalTransactions += item.count;
    });

    const totalBalance = totalIncome - totalExpense;

    // 2. Current Month Totals
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const currentMonthData = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let currentMonthIncome = 0;
    let currentMonthExpense = 0;

    currentMonthData.forEach((item) => {
      if (item._id === "income") currentMonthIncome = item.total;
      if (item._id === "expense") currentMonthExpense = item.total;
    });

    // 3. Current Month Overall Budget comparison
    const currentBudget = await Budget.findOne({
      user: req.user._id,
      month: currentMonth + 1,
      year: currentYear,
      category: "Overall",
    });

    const budgetAmount = currentBudget ? currentBudget.amount : 0;
    const remainingBudget = budgetAmount - currentMonthExpense;
    const budgetPercentage = budgetAmount > 0 ? Math.round((currentMonthExpense / budgetAmount) * 100) : 0;

    let budgetStatus = "no_budget";
    if (budgetAmount > 0) {
      if (budgetPercentage >= 100) budgetStatus = "exceeded";
      else if (budgetPercentage >= 80) budgetStatus = "warning";
      else budgetStatus = "normal";
    }

    // 4. Category Expense Breakdown (Current Month or All-Time if current month is empty)
    let categoryExpenses = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          type: "expense",
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Fallback to all-time expense categories if this month has no transactions yet
    if (categoryExpenses.length === 0) {
      categoryExpenses = await Transaction.aggregate([
        {
          $match: {
            user: userObjectId,
            type: "expense",
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 6 },
      ]);
    }

    const formattedCategoryBreakdown = categoryExpenses.map((item) => ({
      name: item._id,
      value: item.total,
    }));

    // 5. Monthly Trends (Last 6 Months)
    const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: sixMonthsAgo, $lte: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Fill in last 6 months even if zero transactions
    const trendMap = {};
    monthlyTrends.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      trendMap[key] = { income: item.income, expense: item.expense };
    });

    const formattedTrends = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const key = `${y}-${m}`;
      const data = trendMap[key] || { income: 0, expense: 0 };
      formattedTrends.push({
        month: `${monthNames[m - 1]}`,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
      });
    }

    // 6. Recent Transactions (latest 6)
    const recentTransactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      summary: {
        totalBalance,
        totalIncome,
        totalExpense,
        currentMonthIncome,
        currentMonthExpense,
        totalTransactions,
      },
      budget: {
        budgetAmount,
        currentMonthExpense,
        remainingBudget,
        budgetPercentage,
        budgetStatus,
        isOverBudget: budgetAmount > 0 && currentMonthExpense > budgetAmount,
      },
      categoryBreakdown: formattedCategoryBreakdown,
      monthlyTrends: formattedTrends,
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
