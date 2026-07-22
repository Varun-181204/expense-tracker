const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getCategorySummary,
  getMonthlySummary
} = require("../controllers/transactionController");


router.post("/", protect, addTransaction);
router.get("/summary", protect, getSummary);
router.get("/category-summary", protect, getCategorySummary);
router.get("/monthly-summary", protect, getMonthlySummary);
router.get("/", protect, getTransactions);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);


module.exports = router;