const logger = require('../utils/logger');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Customer = require('../models/customer');
const sms = require('../providers/sms');
const email = require('../providers/email');

const algorithm = 'aes256'; 
const key = process.env.PASSWORD_KEY;

const createCustomer = async(req, res, next) => {
    
    const payload = {
        name: req.body.user.name,
        phone: req.body.user.phone,
        email: req.body.user.email || null,
        password: req.body.user.password
    };
    
    logger.info('Creating New Customer', payload);

    const customer = new Customer(payload);

    try {
        const newCustomer = await customer.save();
        if (newCustomer.isActive) {
            logger.info('New customer created.', customer.name);
            // Notify Customer
            sms.welcomeCustomer(customer.phone, customer.name);
            return newCustomer;
        } else {
            throw new Error(err)
        }
    } catch(err) {
        return err;
    }

};

const updateCustomer = ((req, res, next) => {

});


const findCustomer = async(phone) => {

    const query = { phone: parseInt(phone) };
    logger.info(`Find customer - ${query.phone}`);

    try {
        let customer = await Customer.findOne(query).exec();
        if (customer !== null) {
            return customer;
        }
    } catch(err) {
        logger.error(`Unable to find customer ${phone}`);
        return err
    }
    
};

const authCustomer = async(req, res, next) => {

    const query = { phone: parseInt(req.body.phone) };
    const password = req.body.password;

    try {
        let customer = await Customer.findOne(query, 'customerID name phone email password').exec();

        // Customer not Found
        if (customer === null) {
            customer = "ERROR";
            return customer;
        } else { // Customer found but validate Password
            if (!customer.validatePassword(customer.password, password)) {
                customer = 'INCORRECT';
                return customer;
            }
        }

        return customer;

    } catch(err) {
        return err;
    }

}

const authCustomerByOTP = async(req, res, next) => {

}


module.exports = {
    createCustomer,
    updateCustomer,
    findCustomer,
    authCustomer
}