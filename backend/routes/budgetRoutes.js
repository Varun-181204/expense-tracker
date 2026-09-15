const express = require("express");
const router = express.Router();
const {
  getBudgetSummary,
  setOverallBudget,
  setCategoryBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const protect = require("../middleware/authMiddleware");

// All budget routes are protected
router.use(protect);

router.route("/")
  .get(getBudgetSummary)
  .post(setOverallBudget);

router.post("/category", setCategoryBudget);
router.delete("/:id", deleteBudget);

module.exports = router;