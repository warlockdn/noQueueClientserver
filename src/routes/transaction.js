const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt');
const transaction = require('../controllers/transaction');

router.use((req, res, next) => {
    jwt.jwtMiddleware(req, res, next);
})

router.route('/razor')
    .get(transaction.getRazorOrders)


module.exports = router;