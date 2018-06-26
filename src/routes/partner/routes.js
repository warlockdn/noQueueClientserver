const express = require('express');
const router = express.Router();
const auth = require('./auth');
const partner = require('./partner');

router.use('/auth', auth);

router.route('/orders')
    .get()
    .post()

module.exports = router;