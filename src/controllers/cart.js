const logger = require('../utils/logger');
const express = require('express');
const cart = require('../helper/cart');
const firebase = require('../providers/firebase');
const razorPay = require('../providers/razorPay/index');
// const payTM = require('../paytm/checksum');
// const payTMConfig = require('../paytm/paytm_config');

const manageCart = async(req, res, next) => {

    try {

        const customerID = req.body.customerID || null;
        const cartData = req.body.cart;
        const notes = req.body.notes || null;
        const partner = req.body.partner || null;

        if (!cartData.partnerID) {
            throw new Error('Partner ID missing');
        }

        if (!customerID) {
            throw new Error('Error finding Customer ID');
        }
    
        const newCart = await cart.manageCart(cartData, customerID, cartData.partnerID, notes, partner);

        if (newCart === "ERROR" || newCart === "DUPLICATE") {
            throw new Error("ERROR")
        } else {
            
            const newOrder = await razorPay.createOrder(newCart.total, newCart.id, newCart);

            if (newOrder.code === 200) {

                return res.status(200).json({
                    status: 200,
                    message: "Cart updated successfully",
                    cart: newCart,
                    orderID: newOrder.id
                })

            } else {

                throw new Error(newOrder);

            }

        }


        
    } catch (err) {

        logger.info(`Error creating Cart: ${err}`);

        if (err === "Partner ID missing" || err === "Error finding Customer ID") {
            return res.status(200).json({
                status: 200,
                message: "Incorrect request"
            });
        } 

        return res.status(500).json({
            status: 500,
            message: "Error while updating cart"
        });

    }

}

const verifyOrderPayment = async(req, res, next) => {

    logger.info('verifyOrderPayment(): Verifying Payment ' + req.body.orderID);

    try {

        const orderID = req.body.orderID;
        const paymentID = req.body.paymentID;
        const amount = req.body.amount;

        if (!orderID || !paymentID) {
            throw new Error('Empty parameter.');
        }

        // Capture payment.
        const status = await razorPay.confirmPayment(paymentID, amount);
        // const verifyAmount = await cart.checkPayment(orderID, )

        if (status.code === 500) {
            throw new Error(status.data);
        }   
        
        return res.status(200).json({
            status: status.code,
            message: "Payment captured and validated successfully"
        })
        
    } catch(err) {

        logger.info('verifyOrderPayment(): Error ' + err);

        return res.status(500).json({
            status: 500,
            message: err.message
        })

    }

}

const notifyCartStatus = async(req, res, next) => {

    const orderID = req.body.orderID;
    const status = req.body.status || "PAID";

    try {

        if (!orderID || !status) {
            throw new Error("Parameters missing");
        }

        let order = await cart.fetchCart(orderID, status);
        
        if (order === "ERROR") {
            throw new Error(order);
        } else {

            // Order found. Now save it to Firebase and return doc ID but set Order Stages

            order.stage = {
                placed: true,
                accepted: false,
                ready: false,
                delivered: false,
                declined: false
            };

            const newOrder = await firebase.createOrderFirebase(order);

            if (!newOrder.id) {
                throw new Error("Firebase doc creation failed");
            }

            return res.status(200).json({
                status: 200,
                refid: newOrder.id
            });

        }

    } catch(err) {

        logger.info("Error updating order status ", err);

        return res.status(500).json({
            status: 500,
            message: "Error"
        })

    }


}

module.exports = {
    manageCart,
    verifyOrderPayment,
    notifyCartStatus
}