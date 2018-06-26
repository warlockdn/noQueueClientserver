const express = require('express');
const router = express.Router();
const auth = require('../../controllers/partner/auth');

router.route('/login')
    .post(auth.authenticate);

module.exports = router;