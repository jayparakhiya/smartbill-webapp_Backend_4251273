const express = require('express');
const { getHSNDetails } = require('../controller/hsnController');

const router = express.Router();

router.get('/', getHSNDetails);

module.exports = router;
