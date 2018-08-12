const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const misc = require('../controllers/misc');

router.use((req, res, next) => {
    jwt.jwtMiddleware(req, res, next);
})

router.route('/orders')
    .get(misc.getOrderList);

router.route('/order:id')
    .get(misc.getOrderbyID);

router.route('/fetch')
    .get(misc.fetchForCustomer);

module.exports = router;