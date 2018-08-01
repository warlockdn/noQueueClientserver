const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart');

router.route('/manage')
    .post(cart.manageCart);

router.route("/notify")
    .post(cart.notifyCartStatus);

router.route("/capture")
    .post(cart.verifyOrderPayment);


module.exports = router;