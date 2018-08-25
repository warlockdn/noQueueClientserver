const logger = require('../utils/logger');
const express = require('express');
const Coupon = require('../models/couponModel');

const couponHelper = require('../helper/coupon');

const validateCoupon = async(req, res, next) => {

    const couponCode = req.body.couponCode;
    const partnerID = req.body.partnerID || null;
    const customerID = req.body.customer.id;
    const cartTotal = req.body.cartTotal / 100;
    let customerCheck = null;

    let date = new Date().toISOString();

    try {
        
        let coupon = await Coupon.findOne({ discountCode: couponCode, isActive: true, 'validity.startTime': { $lte: date }, 'validity.endTime': { $gte: date } }).where('discountFrom.partnerID').in([partnerID, null]).exec();

        if (!coupon) {
            throw new Error(coupon);
        }

        if (coupon) {
            customerCheck = await couponHelper.checkLimitCustomer(customerID, coupon.id)
        }

        if (coupon && customerCheck !== null) {

            coupon = JSON.parse(JSON.stringify(coupon));
    
            // Check for total number of uses.
            if (coupon.usageLimits) {

                // Checking whether usage limit is set to one customer only.
                if (coupon.usageLimits.limitOne === true && customerCheck === true) {

                    return res.status(200).json({
                        code: 204,
                        message: "Coupon cannot be used more than once."
                    })

                }
    
                // Checking for Total Limit with Total Used times
                if (coupon.usageLimits.totalLimit !== null) {
    
                    if (coupon.usageLimits.totalLimit === coupon.usedCount) {
                        
                        couponHelper.disableCoupon(coupon.id, coupon.discountCode);
    
                        return res.status(200).json({
                            code: 204,
                            message: "Reached maximum number of coupon usage"
                        })
                    }
    
                }
                
                // Is it limited to one.
                if (coupon.usageLimits.islimitOne) {
    
                    // let customerCheck = await couponHelper.checkLimitCustomer(customerID, coupon.id)
    
                    if (!customerCheck) {
                        return res.status(200).json({
                            code: 204,
                            message: "Coupon has been already used by the customer"
                        })
                    }
    
                }
    
            }
    
            // Checking Minimum Amount
            if (coupon.minimumAmount) {
    
                if (cartTotal < coupon.minimumAmount) {
                    const diff = coupon.minimumAmount - cartTotal;
                    return res.status(200).json({
                        code: 204,
                        message: `Coupon doesn't qualify. Add Rs. ${diff} more`
                    })
    
                }
    
            }
    
            if (coupon.discountOptions.type === "percentage") {

                let discount = ((cartTotal * coupon.discountOptions.value) / 100) * 100

                return res.status(200).json({
                    code: 200,
                    message: "Coupon valid and applied",
                    couponAmount: discount
                });

            } else if (coupon.discountOptions.type === "fixed") {

                return res.status(200).json({
                    code: 200,
                    message: "Coupon valid and applied",
                    couponAmount: (coupon.discountOptions.value * 100)
                });

            } else {
                throw new Error('err');
            }

        }
    

    } catch(err) {

        return res.status(500).json({
            status: 500,
            message: "No coupons found"
        })

    }

}

const consumeCoupon = async(couponCode, customerID, partnerID, cartTotal) => {

    try {
        
        let coupon = await Coupon.findOne({ discountCode: couponCode, isActive: true, 'validity.startTime': { $lte: new Date() }, 'validity.endTime': { $gte: new Date() } }).where('discountFrom.partnerID').in([partnerID, null]).exec();

        if (!coupon) {
            throw new Error(coupon);
        }

        if (coupon) {
            customerCheck = await couponHelper.checkLimitCustomer(customerID, coupon.id)
        }

        if (coupon && customerCheck !== null) {

            coupon = JSON.parse(JSON.stringify(coupon));
    
            // Check for total number of uses.
            if (coupon.usageLimits) {

                // Checking whether usage limit is set to one customer only.
                if (coupon.usageLimits.limitOne === true && customerCheck === true) {

                    return {
                        code: 204,
                        message: "Coupon cannot be used more than once."
                    }

                }
    
                // Checking for Total Limit with Total Used times
                if (coupon.usageLimits.totalLimit !== null) {
    
                    if (coupon.usageLimits.totalLimit === coupon.usedCount) {
                        
                        couponHelper.disableCoupon(coupon.id, coupon.discountCode);
    
                        return {
                            code: 204,
                            message: "Reached maximum number of coupon usage"
                        }
                    }
    
                }
                
                // Is it limited to one.
                if (coupon.usageLimits.islimitOne) {
    
                    // let customerCheck = await couponHelper.checkLimitCustomer(customerID, coupon.id)
    
                    if (!customerCheck) {
                        return {
                            code: 204,
                            message: "Coupon has been already used by the customer"
                        }
                    }
    
                }
    
            }
    
            // Checking Minimum Amount
            if (coupon.minimumAmount) {
    
                if (cartTotal < coupon.minimumAmount) {
                    const diff = coupon.minimumAmount - cartTotal;
                    return {
                        code: 204,
                        message: `Coupon doesn't qualify. Add Rs. ${diff} more`
                    }
    
                }
    
            }
    
            if (coupon.discountOptions.type === "percentage") {

                // Update coupon count by 1
                couponHelper.updateCouponCount(coupon.id, true);

                // Update customer of using Coupon
                couponHelper.updateCouponUsageCustomer(customerID, coupon.id);

                let discount = (cartTotal * coupon.discountOptions.value) / 100;

                return {
                    code: 200,
                    couponID: coupon.id,
                    couponCode: coupon.discountCode,
                    message: "Coupon valid and applied",
                    couponAmount: discount
                };

            } else if (coupon.discountOptions.type === "fixed") {

                // Update coupon count by 1
                couponHelper.updateCouponCount(coupon.id, true);

                // Update customer of using Coupon
                couponHelper.updateCouponUsageCustomer(customerID, coupon.id);

                return {
                    code: 200,
                    couponID: coupon.id,
                    couponCode: coupon.discountCode,
                    message: "Coupon valid and applied",
                    couponAmount: coupon.discountOptions.value
                };

            } else {
                return {
                    code: 500,
                    message: "Technical error occured"
                }
            }

        }
    

    } catch(err) {

        return res.status(500).json({
            status: 500,
            message: "No coupons found"
        })

    }

}

module.exports = {
    validateCoupon,
    consumeCoupon
}