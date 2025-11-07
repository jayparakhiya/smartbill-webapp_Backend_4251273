const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createExpense, getExpenses } = require('../controller/expenseController');

// Define routes
router.post('/add', auth, createExpense);
router.get('/all', auth ,getExpenses);

module.exports = router;