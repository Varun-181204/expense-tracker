const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  setBudget,
  getBudget,
} = require("../controllers/budgetController");

router.post("/", protect, setBudget);

router.get("/", protect, getBudget);

module.exports = router;