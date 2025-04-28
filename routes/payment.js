const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require("../middlewares/AuthMiddleware");


router.post('/create-checkout-session', isAuthenticated,   paymentController.getCheckoutSession);
router.get('/success',isAuthenticated, paymentController.handlePaymentSuccess);

module.exports = router;