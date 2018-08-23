const logger = require('../utils/logger');
const Coupon = require('../models/couponModel');
const Customer = require('../models/customer');

// Will check if the customer has used the coupon, again to check One coupon per customer
const checkLimitCustomer = async(customerID, couponID) => {

    logger.info("checkLimitCustomer(): Checking for coupon usage" + customerID + " - " + couponID);

    try {

        const customer = await Customer.findOne({ customerID: customerID }).where('usedCoupons').in([couponID]).exec();
    
        if(!customer) {
            throw new Error(customer);
        }

        logger.info("checkLimitCustomer(): Coupon has been used" + customerID + " - " + couponID);

        return true;
    } catch(err) {

        logger.info("checkLimitCustomer(): Coupon not used");

        return false;
    }

}

// Will be useful for One Coupon per customer
const updateCouponUsageCustomer = async(customerID, couponID) => {

    try {

        logger.info("updateCouponUsageCustomer(): Updating usage for coupon " + customerID + " - " + couponID);

        const updatedCustomer = await Customer.updateOne({ customerID: customerID }, { $addToSet: { usedCoupons: couponID } }).exec();

        if (!updatedCustomer) {
            throw new Error(updatedCustomer);
        }

        logger.info("updateCouponUsageCustomer(): Updated usage for coupon " + customerID + " - " + couponID);

        return true;

    } catch(err) {

        logger.info("updateCouponUsageCustomer(): Error updating coupon " + customerID + " - " + couponID);

        return false;

    }

}

module.exports = {
    checkLimitCustomer,
    updateCouponUsageCustomer
}