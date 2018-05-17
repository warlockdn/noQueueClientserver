const logger = require('../utils/logger');
const customer = require('../controllers/customer');

const findCustomer = async(req, res, next) => {

    const status = await customer.findCustomer(req, res, next);

    if (status) {
        
        logger.info(`Account Exists ${req.body.phone}`);

        return res.status(200).json({
            status: 200,
            result: true,
            message: 'Account exists',
        })

    } else {

        logger.info(`Account doesn\'t exist ${req.body.phone}`);

        return res.status(200).json({
            status: 200,
            result: false,
            message: 'Account doesn\'t exist',
        })
    }

};

const authByPhonePass = async(req, res, next) => {
    
    const result = await customer.authCustomer(req, res, next);

    if (result === 'EMPTY') {
        
        logger.error('Customer does not exist ', req.body.phone)
        
        return res.status(401).json({
            status: 401,
            message: 'Error finding customer'
        })

    } else if (result === 'INCORRECT') {
        
        const data = {
            phone: req.body.phone,
            password: req.body.password
        };

        logger.error(`Incorrect Credentials ${data}`)

        return res.status(401).json({
            status: 401,
            message: 'Password Incorrect'
        })

    } else {
        
        const customer = result;
        logger.info(`Customer exists - ${customer}`);
        
        return res.status(200).json({
            status: 200,
            details: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            }
        });

    }
 
};

const authByOTP = async(req, res, next) => {

};

const createCustomer = async(req, res, next) => {
    customer.createCustomer(req, res, next);
}

module.exports = {
    findCustomer,
    authByPhonePass,
    authByOTP,
    createCustomer
}