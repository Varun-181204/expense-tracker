const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// ===============================
// Add Transaction
// ===============================

const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
    });

    res.status(201).json({
      message: "Transaction Added",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get All Transactions
// ===============================

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Transaction
// ===============================

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Transaction Updated",
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Delete Transaction
// ===============================

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Transaction Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Dashboard Summary
// ===============================

const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Category Summary
// ===============================

const getCategorySummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          type: "Expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Monthly Summary
// ===============================

const getMonthlySummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: {
              $cond: [
                { $eq: ["$type", "Income"] },
                "$amount",
                0,
              ],
            },
          },
          expense: {
            $sum: {
              $cond: [
                { $eq: ["$type", "Expense"] },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getCategorySummary,
  getMonthlySummary,
};