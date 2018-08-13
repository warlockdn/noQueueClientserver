const express = require('express');
const router = express.Router();
const jwt = require('../../middleware/jwt');
const customer = require('../../controllers/partner/customer');

// router.use((req, res, next) => {})

router.use((req, res, next) => {
    jwt.jwtMiddleware(req, res, next);
})

router.route('/findCustomer')
    .post(customer.findCustomer);

router.route('/registerCustomer')
    .post(customer.createCustomer);

router.route('/checkIn')
    .post(customer.checkIn);

router.route('/checkOut')
    .post(customer.checkOut);

module.exports = router;