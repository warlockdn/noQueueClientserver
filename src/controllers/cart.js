const logger = require('../utils/logger');
const express = require('express');
const cart = require('../helper/cart');
const firebase = require('../providers/firebase');
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
        }

        return res.status(200).json({
            status: 200,
            message: "Cart updated successfully",
            cart: newCart
        })
        
        /* let paymentParams = {
            // MID: payTMConfig.paytm_config.MID,
            ORDER_ID: newCart.id,  //should be unique
            CUST_ID: customerID,
            TXN_AMOUNT: newCart.total,
            // CHANNEL_ID: 'WAP',
            // INDUSTRY_TYPE_ID: payTMConfig.paytm_config.INDUSTRY_TYPE_ID,
            // WEBSITE: payTMConfig.paytm_config.WEBSITE,
            // CALLBACK_URL: payTMConfig.paytm_config.CALLBACK_URL
        }; */

        /* payTM.genchecksum(paymentParams, payTMConfig.paytm_config.MERCHANT_KEY).then(
            (response) => {
                return res.status(200).json({
                    status: 200,
                    message: "Cart updated successfully",
                    cart: newCart,
                    paymentLink: response
                })
            }
        ).catch(err => {
            throw new Error(err);
        }); */

        
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
    notifyCartStatus
}