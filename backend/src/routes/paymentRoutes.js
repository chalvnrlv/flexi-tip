const express = require('express');
const { processPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/checkout', protect, processPayment);

module.exports = router;
