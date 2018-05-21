const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

router.route('/findCustomer')
    .post(auth.findCustomer);

router.route('/login')
    .post(auth.authByPhonePass);

router.route('/sendotp')
    .post(auth.sendOTP)

router.route('/loginByOtp')
    .post(auth.authByOTP);

router.route('/registration')
    .post(auth.createCustomer);

module.exports = router;