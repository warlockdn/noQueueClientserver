const logger = require('../../utils/logger');
const RazorPay = require('razorpay');

let instance = new RazorPay({
    key_id: process.env.paymentkeyID,
    key_secret: process.env.keySecret
});

// create order
const createOrder = async(amount, orderID, cartData) => {

    logger.info(`createOrder(): Creating new Order #${orderID}`);

    try {

        const notes = {
            id: cartData.id,
            customerID: cartData.customerID,
            total: cartData.total,
            tax: cartData.tax || null,
            partnerID: cartData.partnerID
        }

        const newOrder = await instance.orders.create({ 
            amount: amount, 
            currency: "INR", 
            receipt: orderID,
            notes: notes
        });

        logger.info(`createOrder(): Order created successfully: #${orderID} - ${newOrder.id}`);

        return {
            code: 200,
            id: newOrder.id
        }

    } catch(err) {

        logger.info(`createOrder(): Error creating order - ${err}`);

        return {
            code: 500,
            error: err
        }

    }

}

// Confirm Payment and Capture.
const confirmPayment = async(payment_id, amount) => {

    logger.info("confirmPayment(): Capturing payment: " + payment_id);

    try {

        const capture = await instance.payments.capture(payment_id, amount);

        if (capture.id) {

            logger.info("confirmPayment(): Payment Capture successfully: " + capture);

            return {
                code: 200,
                data: capture
            };

        } else {
            throw new Error("Amount is not valid.")
        }

    } catch(err) {

        logger.info("confirmPayment(): Error capturing payment : " + err);

        return {
            code: 500,
            data: "Payment verification failed."
        }

    }

}

const getAllOrders = async() => {

    try {
        
        const orders = await instance.orders.all({
            from: 1528613795000,
            to: Date.now()
        })
    
        return orders;

    } catch(e) {
        return "ERROR";
    }

}

module.exports = {
    createOrder,
    confirmPayment,
    getAllOrders
}