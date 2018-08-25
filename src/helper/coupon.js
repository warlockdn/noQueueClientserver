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

/**
 * After every coupon use update coupon count.
 * @argument couponID Coupon ID for the coupon
 * @argument toDisable Does it need to disable the coupon as well
*/
const updateCouponCount = async(couponID, isEnabled) => {

    try {

        let updatedCoupon = await Coupon.findOneAndUpdate({ id: couponID }, {
            $set: {
                isActive: isEnabled
            }, $inc: {
                usedCount: 1
            }
        });
    
        if (!updatedCoupon) {
            throw new Error(updatedCoupon);
        }

        logger.info(`Coupon count updated ${couponID}`)

    } catch(err) {
        logger.info(`Error updating Coupon Count for ${couponID}`);
    }



}

/**
 * Disable coupon due to exceeding total limit. Once disabled notify partner.
 * @param couponID Coupon ID for the coupon.
 * @returns nothing.
*/
const disableCoupon = async(couponID, couponCode) => {

    try {

        const couponStatus = await Coupon.updateOne({ id: couponID, discountCode: couponCode }, {
            $set: {
                isActive: false
            }
        }).exec();
    
        if (!couponStatus) {
            throw new Error(couponStatus);
        }

        logger.info(`disableCoupon(): Coupon was disabled as number of uses were reached. - ${couponID} : ${couponCode}`);

    } catch(err) {
        logger.info(`disableCoupon(): Error disabling coupon - ${couponID} : ${couponCode}`);
    }

}

module.exports = {
    checkLimitCustomer,
    updateCouponUsageCustomer,
    disableCoupon,
    updateCouponCount
}