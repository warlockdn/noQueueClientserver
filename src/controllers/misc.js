const logger = require('../utils/logger');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');

const getOrderList = async(req, res, next) => {

    const customerID = req.body.customerID;

    try {

        if (!customerID) {
            throw new Error("Customer Id not valid", customerID);
        }
        
        const orders = await Cart.find({ customerID: customerID }, { id, partnerID, cart, createdOn, updatedOn, totalItems, total, status }).exec();
    
        if (!orders) {
            throw new Error(orders);
        }

        return res.status(200).json({
            status: 200,
            message: "Orders successfully retreived",
            orders: orders
        })

    } catch(err) {

        logger.info("Error fetching order list ", err);

        res.status(500).json({
            status: 200,
            message: "Error fetching order list"            
        })

    }

}

module.exports = {
    getOrderList
}