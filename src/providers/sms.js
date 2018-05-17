const logger = require('../utils/logger');
const request = require('request');

const sendOTP = async(phoneNumber) => {
    
    let param = {
            authkey: process.env.SMS_AUTH_KEY,
            message: `Your verification code is ##OTP##`,
            sender: process.env.SMS_SENDER_REG,
            mobile: '91' + phoneNumber
    }   
    
    request.post({url: process.env.SMS_HOST, form: param}, function(err, response, body) {
        logger.info('Message sent successfully to ', phoneNumber)
    })

}

const welcomeCustomer = async(phoneNumber, name) => {
    
    let param = {
        sender: process.env.SMS_SENDER_REG,
        route: 4,
        mobiles: '91' + phoneNumber,
        country: 91,
        authkey: process.env.SMS_AUTH_KEY,
        message: `Glad to have you with us ${name}. Your satisfaction is our responsibility. Cheers to your journey with us. \n Team RezApp`
    }   

    request.get({uri: process.env.SMS_HOST, qs: param}, function(err, response, body) {
        logger.info('Message sent successfully to ', phoneNumber);
    })

}

module.exports = { sendOTP, welcomeCustomer }