const logger = require('../utils/logger');
const express = require('express');
const Coupon = require('../models/couponModel');

const validateCoupon = async(req, res, next) => {

    const couonID = req.body.couponID;
    const partnerID = req.body.partnerID;

    try {
        
        let coupon = await Coupon.findOne({ id: couponID, 'discountFrom.partnerID': partnerID, 'discountFrom.partnerID': null, isActive: true }).exec();
    
        if (!coupons) {
            throw new Error(coupons);
        }
    
        coupon = JSON.parse(JSON.stringify(coupon));

        // Check for total number of uses.
        if (coupon.usageLimits) {
            if (coupon.usageLimits.islimitOne) { // Is it limited to one.

            }
        }

    } catch(err) {

        return res.status(500).json({
            status: 500,
            message: "No coupons found"
        })

    }
    


}