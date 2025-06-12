const express = require('express');
const router = express.Router();
const DiscountController = require('../controllers/DiscountController');

router.post('/calculate', DiscountController.calculateDiscount);

module.exports = router;