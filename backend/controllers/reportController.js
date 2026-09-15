const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// Helper to determine date boundaries based on filter range
const getDateRange = (filter, customStart, customEnd) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  let startDate = new Date(currentYear, currentMonth, 1);
  let endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

  switch (filter) {
    case "last-month": {
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      startDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1);
      endDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "last-6-months": {
      startDate = new Date(currentYear, currentMonth - 5, 1);
      endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "this-year": {
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      break;
    }
    case "all-time": {
      startDate = new Date(2000, 0, 1);
      endDate = new Date(currentYear + 1, 11, 31, 23, 59, 59, 999);
      break;
    }
    case "custom": {
      if (customStart) startDate = new Date(customStart);
      if (customEnd) {
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
      }
      break;
    }
    case "this-month":
    default:
      // default is this-month
      break;
  }

  return { startDate, endDate };
};

// @desc    Get financial report analytics with time filters
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res, next) => {
  try {
    const { timeRange = "this-month", startDate: customStart, endDate: customEnd } = req.query;
    const { startDate, endDate } = getDateRange(timeRange, customStart, customEnd);
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Overall Income & Expense Totals for the selected range
    const totalsData = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
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
    let transactionCount = 0;

    totalsData.forEach((item) => {
      if (item._id === "income") {
        totalIncome = item.total;
      } else if (item._id === "expense") {
        totalExpense = item.total;
      }
      transactionCount += item.count;
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Number(((netSavings / totalIncome) * 100).toFixed(1))) : 0;

    // 2. Category-wise Expense Breakdown
    const categoryExpenses = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const formattedCategoryExpenses = categoryExpenses.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
      percentage: totalExpense > 0 ? Math.round((item.total / totalExpense) * 100) : 0,
    }));

    // 3. Category-wise Income Breakdown
    const categoryIncomes = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          type: "income",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const formattedCategoryIncomes = categoryIncomes.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
      percentage: totalIncome > 0 ? Math.round((item.total / totalIncome) * 100) : 0,
    }));

    // 4. Monthly Timeline Trends (aggregated by Month & Year)
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startDate, $lte: endDate },
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
    const formattedMonthlyTrends = monthlyTrends.map((item) => {
      const label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      return {
        label,
        year: item._id.year,
        month: item._id.month,
        income: item.income,
        expense: item.expense,
        net: item.income - item.expense,
      };
    });

    res.status(200).json({
      timeRange,
      startDate,
      endDate,
      summary: {
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate,
        transactionCount,
      },
      categoryExpenses: formattedCategoryExpenses,
      categoryIncomes: formattedCategoryIncomes,
      monthlyTrends: formattedMonthlyTrends,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
};
