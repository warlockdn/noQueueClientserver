const express = require('express');
const router = express.Router();
const auth = require('./auth');
// const partner = require('./partner');
const order = require('../../controllers/partner/orders');
const customer = require('../partner/customer');
const hotel = require('../../controllers/partner/hotel');

const jwt = require('../../middleware/jwt');

router.use('/auth', auth);
router.use('/customer', customer);

router.use((req, res, next) => {
    jwt.jwtMiddleware(req, res, next);
})

router.route('/orders')
    .post(order.updateOrderStatus);

router.route('/rooms')
    .get(hotel.getRooms);

router.route('/bookings')
    .get(hotel.getBookings);

module.exports = router;    