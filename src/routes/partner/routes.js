const express = require('express');
const router = express.Router();
const auth = require('./auth');
// const partner = require('./partner');
const order = require('../../controllers/partner/orders');

router.use('/auth', auth);

router.route('/orders')
    // .get()
    .post(order.updateOrderStatus)

module.exports = router;    