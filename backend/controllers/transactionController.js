const Transaction = require("../models/Transaction");

// @desc    Get all transactions for logged in user (with search, filters, and pagination)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const { search, type, category, startDate, endDate, sortBy, page, limit } = req.query;

    const query = { user: req.user._id };

    // Filter by type: 'income' or 'expense'
    if (type && type !== "all") {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    // Search in title and description
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { category: searchRegex }];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sorting
    let sortOptions = { date: -1, createdAt: -1 };
    if (sortBy === "date_asc") sortOptions = { date: 1 };
    else if (sortBy === "date_desc") sortOptions = { date: -1 };
    else if (sortBy === "amount_desc") sortOptions = { amount: -1 };
    else if (sortBy === "amount_asc") sortOptions = { amount: 1 };

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 0; // 0 means return all
    const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;

    let transactionQuery = Transaction.find(query).sort(sortOptions);
    if (limitNum > 0) {
      transactionQuery = transactionQuery.skip(skip).limit(limitNum);
    }

    const [transactions, totalCount] = await Promise.all([
      transactionQuery,
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: transactions.length,
      totalCount,
      page: pageNum,
      totalPages: limitNum > 0 ? Math.ceil(totalCount / limitNum) : 1,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Verify ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this transaction" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({
        message: "Please provide title, amount, type (income/expense), and category",
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number greater than zero" });
    }

    const normalizedType = type.toLowerCase().trim();
    if (!["income", "expense"].includes(normalizedType)) {
      return res.status(400).json({ message: "Type must be either 'income' or 'expense'" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title: title.trim(),
      amount: numAmount,
      type: normalizedType,
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Verify ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this transaction" });
    }

    const { title, amount, type, category, date, description } = req.body;

    if (title) transaction.title = title.trim();
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
      }
      transaction.amount = numAmount;
    }
    if (type) {
      const normalizedType = type.toLowerCase().trim();
      if (!["income", "expense"].includes(normalizedType)) {
        return res.status(400).json({ message: "Type must be either 'income' or 'expense'" });
      }
      transaction.type = normalizedType;
    }
    if (category) transaction.category = category.trim();
    if (date) transaction.date = new Date(date);
    if (description !== undefined) transaction.description = description.trim();

    const updatedTransaction = await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Verify ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this transaction" });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Transaction deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};