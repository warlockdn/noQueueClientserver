const logger = require('../utils/logger');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const customer = require('../helper/customer');

const getOrderList = async(req, res, next) => {

    const customerID = req.body.customer.id;

    try {

        if (!customerID) {
            throw new Error("Customer Id not valid", customerID);
        }
        
        const orders = await Cart.find({ customerID: customerID, status: "PAID" }, 'id partnerID partnerName cart createdOn updatedOn totalItems total tax status').sort({
            createdOn: -1
        }).exec()
    
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
            status: 500,
            message: "Error fetching order list"            
        })

    }

}

const getOrderbyID = async(req, res, next) => {

    const customerID = req.body.customer.id;
    const orderID = req.params.orderID;

    logger.info("Finding order: " + customerID + ' - ' + orderID);

    try {

        const order = await Cart.findOne({ customerID: customerID, id: orderID }, 'id partnerID partnerName cart createdOn updatedOn totalItems total tax status').exec();

        if (!order) {
            throw new Error(order);
        }

        logger.info("getOrderbyID() Order: ", order);

        return res.status(200).json({
            status: 200,
            messaage: "Order fetched successfully",
            order: order
        })

    } catch(err) {

        logger.info("Error fetching order", err);

        res.status(200).json({
            status: 500,
            message: "No order found"
        })

    }

}

const fetchForCustomer = async(req, res, next) => {

    logger.info("fetchForCustomer(): Fetching...");

    const customerID = req.body.customer.id;

    try {

        const data = await customer.fetch(customerID);

        if (data === "NOPE") {
            throw new Error(data);
        }

        return res.status(200).json({
            status: 200,
            message: "Data found",
            details: data.checkIn
        })

    } catch(err) {

        logger.info("fetchForCustomer(): result ", err);

        return res.status(200).json({
            status: 500,
            message: "No detail exist"
        })

    }

}

module.exports = {
    getOrderList,
    getOrderbyID,
    fetchForCustomer
}