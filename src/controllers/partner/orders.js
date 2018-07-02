const logger = require('../../utils/logger');
const express = require('express');
const cart = require('../../helper/cart');
const firebase = require('../../providers/firebase');

const updateOrderStatus = async(req, res, next) => {

    const orderID = req.body.orderID;
    const status = req.body.status;
    const tokenID = req.body.tokenID; // Firebase Doc ID

    try {

        let order = await cart.fetchCart(orderID, status);

        if (order === "ERROR") {
            throw new Error ("Error updating order");
        } else {

            const updatedStatus = await firebase.updateOrderStatusFirebase(tokenID, orderID, status);

            if (updatedStatus === "ERROR") {
                throw new Error("ERROR");
            }
            return res.status(200).json({
                status: 200,
                orderID: orderID,
                message: "Status Updated successfully"
            })

        }

    } catch(err) {

        logger.info("Error updating order");

        return res.status(500).json({
            status: 500,
            message: "Error updating order status"
        });

    }

}

module.exports = {
    updateOrderStatus
}