const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Set Budget
const setBudget = async (req, res) => {

  try {

    const { month, year, amount } = req.body;

    let budget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
    });

    if (budget) {

      budget.amount = amount;

      await budget.save();

    } else {

      budget = await Budget.create({
        user: req.user.id,
        month,
        year,
        amount,
      });

    }

    res.json(budget);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// Get Budget Status
const getBudget = async (req, res) => {

  try {

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const budget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
    });

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const spent =
      expenses.length > 0
        ? expenses[0].total
        : 0;

    res.json({

      budget: budget ? budget.amount : 0,

      spent,

      remaining: budget
        ? budget.amount - spent
        : 0,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  setBudget,
  getBudget,
};