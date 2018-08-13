const logger = require('../../utils/logger');
const mongoose = require('mongoose');
const express = require('express');
const Partner = require('../../models/partners');
const Customer = require('../../models/customer');
const customer = require('../../helper/customer');
const sms = require('../../providers/sms');

const findCustomer = async(req, res, next) => {

    const phone = req.body.phone;

    try {

        const customerData = await customer.findCustomer(phone);

        if (!customerData) {
            throw new Error("Customer doesn't exist");
        }

        return res.status(200).json({
            status: 200,
            result: true,
            message: 'Account exists',
            customer: {
                customerID: customerData.customerID,
                name: customerData.name,
                phone: customerData.phone
            }
        });

    } catch(err) {

        return res.status(200).json({
            status: 200,
            result: false,
            message: 'Account doesn\'t exist',
        });

    }

}

const createCustomer = async(req, res, next) => {
    
    const password = randomPassword();

    const payload = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email || null,
        password: password
    };
    
    logger.info('Creating New Customer', payload);

    const customer = new Customer(payload);

    try {
        const newCustomer = await customer.save();
        if (newCustomer.isActive) {
            
            logger.info('New customer created.', customer.name);

            // Notify Customer
            sms.welcomeCustomerByPartner(customer.phone, customer.name, password);
            
            return res.status(200).json({
                code: 200,
                message: "Account created successfully",
                customer: {
                    customerID: newCustomer.customerID,
                    name: newCustomer.name,
                    phone: newCustomer.phone
                }
            });

        } else {
            throw new Error(newCustomer)
        }
    } catch(err) {
        return res.status(200).json({
            code: 500,
            message: "Error creating customer"
        });
    }

};

const checkIn = async(req, res, next) => {

    try {
        
        const partnerID = req.body.partner.id;
        const customerID = req.body.customerID;
        const enddate = req.body.enddate;
        const room = req.body.room;

        logger.info("checkIn(): Checking in ", partnerID)
        
        const partnerDetail = await Partner.findOne({ partnerID: partnerID }, 'rooms').exec();
        
        // Blocking the room.
        let newRooms = partnerDetail.rooms;
        for(let i = 0; i < newRooms.length; i++) {
            let roomDetail = newRooms[i];
            if (roomDetail.room === room) {
                roomDetail.available = false;
                break;
            }
        }

        // Update Partner
        const updatedPartner = await Partner.findOneAndUpdate({ partnerID: partnerID }, {
            $set: {
                rooms: newRooms
            }
        });

        // Add check in detail to Customer..
        const customerDetail = await Customer.findOneAndUpdate({ customerID: customerID }, {
            $set: {
                isCheckedIn: true,
                checkIn: {
                    name: req.body.partner.name,
                    partnerID: partnerID,
                    room: room,
                    checkOutTime: enddate
                }
            }
        }).exec();

        if (updatedPartner && customerDetail) {
            return res.status(200).json({
                code: 200,
                message: "Checkin done successfully"
            })
        }

    } catch(err) {

        logger.info("Error checking in. ", err);

        return res.status(200).json({
            code: 500,
            message: "Error checking in!"
        })

    }

}

const checkOut = async(req, res, next) => {

    const partnerID = req.body.partner.id;
    const customerID = req.body.customerID;

    try {

        logger.info("checkOut(): Checking out customer " + customerID);

        const customerDetail = await Customer.findOneAndUpdate({ customerID: customerID, isCheckedIn: true, "checkIn.partnerID": partnerID }, {
            $set: {
                isCheckedIn: false,
                checkIn: null
            }
        });

        if (!customerDetail) {
            throw new Error(customerDetail);
        } else {
            
            return res.status(200).json({
                code: 200,
                message: "Checkout successfull"
            })
        }


    } catch(err) {
        return res.status(200).json({
            code: 500,
            message: "Error"
        })
    }
    
}

const randomPassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    let pass = "";
    for (let x = 0; x < 6; x++) {
        let i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

module.exports = {
    findCustomer,
    createCustomer,
    checkIn,
    checkOut
}