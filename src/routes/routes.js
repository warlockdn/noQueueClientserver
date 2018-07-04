const express = require('express');
const auth = require('./auth');
const partner = require('./partner');
const cart = require('./cart');
const transactions = require('./transaction');
const account = require('./misc');

const router = express.Router();

router.use('/auth' , auth);
router.use('/places', partner);
router.use('/cart', cart);
router.use('/transaction', transactions);
router.use('/account', account);

module.exports = router;