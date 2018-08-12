const logger = require('../utils/logger');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const customer = require('../helper/customer');
const partner = require('../helper/partner');

const manageCart = async(cartData, customerID, partnerID, notes, partnerName, room) => {

    try {

        let payload = {
            partnerID: partnerID,
            customerID: customerID,
            cart: cartData.cart,
            totalItems: cartData.totalItems,
            total: cartData.total,
            notes: notes,
            partnerName: partnerName,
            room: room
        }

        if (cartData.tax) {
            payload.tax = cartData.tax;
        }
    
        // Verify and modify cart totalItems, Price and Total.
        let items = Object.keys(cartData.cart);
        let total = 0;
        let totalItems = 0;
        let cartItems = [];
    
        items.forEach(item => {
    
            let items = cartData.cart[item];
    
            // 2 Cases - If Single Item then no Quantities else Quantities (with addons)
            
            items.forEach(item => {
                total += item.price * item.quantity;
                totalItems += item.quantity;
    
                // Push to Cart Items
                cartItems.push(item);
            });
            
        });

        // Convert to paise.
        total = parseInt(total * 100);
    
        if (total !== payload.total || totalItems !== payload.totalItems) {
            throw new Error("Calculation Mismatch");
        } 

        // Add tax if exists
        if (payload.tax) {
            total += payload.tax;
        }
    
        payload.total = total;
        payload.totalItems = totalItems;
        payload.cart = cartItems;
    
        logger.info('Creating new Cart Item ', payload);

        /* 
            Check if a room exists and 
            if exists then find out if its valid and 
            found valid then check partner details if its a hotel or not
            then send it to save.
        */

        if (payload.room) {

            const customerFetch = await customer.fetch(payload.customerID);
            const partnerDetail = await partner.getPartner(payload.partnerID);

            if (customerFetch !== "NOPE" && partnerDetail.characteristics.typeid === "3") {

                const cart = new Cart(payload);
                const newCart = await cart.save();
    
            if (newCart.id) {
                logger.info('New Cart Item added. ', newCart);
                return newCart;
            } else {
                throw new Error(newCart);
            }    

            } else {
                throw new Error("Partner is not a Hotel && Customer isn't checked in.");
            }

        } else {

            // Since its a normal order.
            delete payload.room;
            
            const cart = new Cart(payload);
            const newCart = await cart.save();
    
            if (newCart.id) {
                logger.info('New Cart Item added. ', newCart);
                return newCart;
            } else {
                throw new Error(newCart);
            }

        }
        
    } catch(err) {
        logger.info("Error creating new Cart ", err);
        return "ERROR";
    }

}

const fetchCart = async(orderID, status) => {

    try {

        /* if (status !== "PAID" || status !== "ACCEPTED" || status !== "DELIVERED") { // Paid, Accepted, Delivered
            throw new Error("Matching status not found");
        } */

        const order = await Cart.findOneAndUpdate({ id: orderID }, { $set: {
            status: status
        } }).exec();

        if (!order) {
            throw new Error("orderID not found");
        }

        console.log(order.toJSON());

        return order.toJSON();

    } catch(err) {

        logger.info(err);
        return "ERROR";

    }

}

const checkPayment = async(orderID, amount) => {

    try {

        

    } catch(err) {

    }

}

module.exports = {
    manageCart,
    fetchCart,
    checkPayment
}