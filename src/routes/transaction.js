const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transaction');

router.route('/razor')
    .get(transaction.getRazorOrders)


module.exports = router;