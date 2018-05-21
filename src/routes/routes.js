const express = require('express');
const auth = require('./auth');
const partner = require('./partner');

const router = express.Router();

router.use('/auth' , auth);
router.use('/places', partner);

module.exports = router;