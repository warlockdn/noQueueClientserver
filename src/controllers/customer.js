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
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email || null,
        password: req.body.password
    };
    
    logger.log('Creating New Customer', payload);

    const customer = new Customer(payload);
    
    customer.save().then((customer) => {

        logger.info('New customer created.', customer.name);
        
        // Notify Customer
        sms.welcomeCustomer(customer.phone, customer.name);

        return res.status(200).json({
            status: 200,
            details: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            }
        })
    }).catch((err) => {
        logger.error('Error creating customer', err);
        return res.status(500).json({
            status: 500,
            message: 'Error creating customer'
        })
    })

};

const updateCustomer = ((req, res, next) => {

});


const findCustomer = async(req, res, next) => {

    const query = { phone: req.body.phone };

    logger.info(`Find customer - ${query.phone}`);

    Customer.findOne(query, (err, customer) => {
        if (err) {
            logger.error('Unable to find customer');
            return false;
        } else {
            return true;
        }
    })
    
};

const authCustomer = async(req, res, next) => {

    const query = { phone: req.body.phone };
    const password = req.body.password;

    Customer.findOne(query, (err, customer) => {
        if (err) {
            logger.error('Error finding customer', query);
            return 'EMPTY';
        } else {

            // Validating Password
            if (!customer.validatePassword(customer.password, password)) {
                return 'INCORRECT';
            }

            return customer;

        }
    })

}


module.exports = {
    createCustomer,
    updateCustomer,
    findCustomer,
    authCustomer
}