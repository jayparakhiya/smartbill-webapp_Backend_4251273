const Expense = require('../models/expenseModel');


const createExpense = async (req, res) => {
    const { incoming, outgoing, description, balance } = req.body;
    const userId = req.user.id; // Ensure userId is available from auth middleware
    
    try {
      const expense = new Expense({
        incoming,
        outgoing,
        description,
        balance,
        user: userId,
      });
  
      await expense.save();
      res.status(201).json(expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id; 

    const expenses = await Expense.find({ user: userId });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { createExpense, getExpenses };
