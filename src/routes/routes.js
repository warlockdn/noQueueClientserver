const express = require('express');
const auth = require('./auth');
const partner = require('./partner');
const cart = require('./cart');
const transactions = require('./transaction');

const router = express.Router();

router.use('/auth' , auth);
router.use('/places', partner);
router.use('/cart', cart);
router.use('/transaction', transactions);

module.exports = router;