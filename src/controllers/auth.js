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

const authByPhonePass = async (req, res, next) => {

    const response = await customer.authCustomer(req, res, next);
    
    if (response === 'ERROR') {
        res.status(401).json({
            status: 401,
            message: "Customer doesn't exist"
        });
    } else if(response === 'INCORRECT') {
        res.status(401).json({
            status: 401,
            message: "Incorrect credentials"
        })
    } else {
        res.status(200).json({
            status: 200,
            message: "Success",
            customer: {
                id: response.customerID,
                name: response.name,
                email: response.email,
                phone: response.phone
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