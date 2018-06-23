const logger = require('../utils/logger');
const customer = require('../helper/customer');
const sms = require('../providers/sms');
const jwtProvider = require('../providers/token-generator');

const findCustomer = async(req, res, next) => {

    const status = await customer.findCustomer(req.body.phone);

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
        return res.status(401).json({
            status: 401,
            message: "Customer doesn't exist"
        });
    } else if(response === 'INCORRECT') {
        return res.status(401).json({
            status: 401,
            message: "Incorrect credentials"
        })
    } else {

        const payload = {
            customer: {
                id: response.customerID,
                name: response.name,
                email: response.email,
                phone: response.phone
            },
            type: 'customer'
        };

        jwtProvider.generator(payload).then(
            (token) => {
                return res.status(200).json({
                    status: 200,
                    message: "Success",
                    token: token,
                    customer: {
                        id: response.customerID,
                        name: response.name,
                        email: response.email,
                        phone: response.phone
                    }
                });
            }
        ).catch((err) => {
            return res.status(500).json({
                status: 500,
                message: process.env.ERROR_MSG
            })
        })

    }
 
};

const sendOTP = async(req, res, next) => {
    const phone = req.body.phone;
    logger.info(`Sending OTP to ${phone}`);
    sms.sendOTP(phone);
    return res.status(200).json({
        status: 200,
        message: `OTP send to ${phone}`
    })
};

const authByOTP = async(req, res, next) => {

    const phone = parseInt(req.body.phone);
    const otp = req.body.otp;

    try {
        const status = await sms.verifyOTP(phone, otp);
        console.log(status);
        if (status.type === 'success') {
            // Otp verified. Get customer details.
            const response = await customer.findCustomer(phone);
            const payload = {
                customer: {
                    id: response.customerID,
                    name: response.name,
                    email: response.email,
                    phone: response.phone
                },
                type: 'customer'
            };
            jwtProvider.generator(payload).then((token) => {
                res.status(200).json({
                    status: 200,
                    customer: {
                        id: response.customerID,
                        name: response.name,
                        email: response.email,
                        phone: response.phone
                    },
                    token: token
                });
            }).catch((err) => {
                return res.status(500).json({
                    status: 500,
                    message: process.env.ERROR_MSG
                });
            });
        } else {
            throw new Error('ERROR');
        }
    } catch(err) {
        logger.info(`Error verifying OTP`);
        return res.status(500).json({
            status: 500,
            message: process.env.ERROR_MSG
        });
    }
    
}

const createCustomer = async(req, res, next) => {
    
    try {
        const response = await customer.createCustomer(req, res, next);
        
        if (!response.code) {
            logger.info(`Account created ${response.name} - ${response.phone}`);
        
            const payload = {
                customer: {
                    id: response.customerID,
                    name: response.name,
                    email: response.email,
                    phone: response.phone
                },
                type: 'customer'
            };
        
            jwtProvider.generator(payload).then(
                (token) => {
                    return res.status(200).json({
                        status: 200,
                        message: "Success",
                        token: token,
                        customer: payload.customer
                    });
                }
            ).catch((err) => {
                throw new Error ('Error creating Token')
            })
        } else {
            throw new Error (response);
        }

    } catch(err) {

        logger.info(`Error creating customer ${err}`);

        return res.status(500).json({
            status: 500,
            message: process.env.ERROR_MSG
        });
    }
}

module.exports = {
    findCustomer,
    authByPhonePass,
    sendOTP,
    authByOTP,
    createCustomer
}