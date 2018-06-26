const express = require('express');
const router = express.Router();

// router.use((req, res, next) => {})

router.route('/orders')
    .get()
    .post();

module.exports = router;