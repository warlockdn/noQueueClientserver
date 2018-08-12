const logger = require('../utils/logger');
const express = require('express');
const cart = require('../helper/cart');
const partner = require('../helper/partner');
const firebase = require('../providers/firebase');
const razorPay = require('../providers/razorPay/index');
const transaction = require('../controllers/transaction');

const manageCart = async(req, res, next) => {

    try {

        const customerID = req.body.customerID || null;
        const cartData = req.body.cart;
        const notes = req.body.notes || null;
        const partner = req.body.partner || null;
        const room = req.body.room || null;

        if (!cartData.partnerID) {
            throw new Error('Partner ID missing');
        }

        if (!customerID) {
            throw new Error('Error finding Customer ID');
        }
    
        const newCart = await cart.manageCart(cartData, customerID, cartData.partnerID, notes, partner, room);

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
        const partnerID = req.body.partnerID;

        if (!orderID || !paymentID) {
            throw new Error('Empty parameter.');
        }

        // Capture payment.
        const status = await razorPay.confirmPayment(paymentID, amount);

        if (status.code === 500) {
            throw new Error(status.data);
        }

        if (status.code === 200) {

            let source = {
                channel: "Razorpay",
                orderID: status.data.order_id,
                paymentID:  status.data.id
            }

            let partnerData = await partner.partnerDetail(partnerID);
            let tax = 0;
            
            if (partnerData.taxInfo) {
                Object.keys(partnerData.taxInfo).forEach((key) => {
                    tax += partnerData.taxInfo[key];
                })
            }

            const newTransaction = await transaction.createTransaction(partnerData.partnerID, req.body.customer.id, source, status.data.amount, tax, partnerData.commission);

            if (newTransaction !== "ERROR") {

                return res.status(200).json({
                    status: status.code,
                    message: "Payment captured and validated successfully"
                })

            } else {

                throw new Error("Error creating transaction");

            }
        }
        
        
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