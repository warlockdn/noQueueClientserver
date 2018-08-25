const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const cart = require('../controllers/cart');
const coupon = require('../controllers/coupon');

router.use((req, res, next) => {
    jwt.jwtMiddleware(req, res, next);
})

router.route('/manage')
    .post(cart.manageCart);

router.route("/notify")
    .post(cart.notifyCartStatus);

router.route("/capture")
    .post(cart.verifyOrderPayment);

router.route("/validateCoupon")
    .post(coupon.validateCoupon);

module.exports = router;