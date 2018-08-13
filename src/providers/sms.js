const logger = require('../utils/logger');
const request = require('request');

const sendOTP = (phoneNumber) => {
    
    const param = {
        authkey: process.env.SMS_AUTH_KEY,
        message: `Your verification code is ##OTP##`,
        sender: process.env.SMS_SENDER_REG,
        mobile: '91' + phoneNumber,
        otp_expiry: 5
    }

    request.post({url: process.env.SMS_OTP, form: param}, (err, response, body) => {
        logger.info('Message sent successfully to ', phoneNumber)
        console.log(response)
        console.log(body)
    })

}

const verifyOTP = (phone, otp) => {
    
    const param = {
        authkey: process.env.SMS_AUTH_KEY,
        mobile: '91' + phone,
        otp: otp
    }

    return new Promise((resolve, reject) => {
        request.post({url: process.env.OTP_VERIFY, form: param}, (err, response, body) => {
            const result = JSON.parse(response.body);            
            if (result.type === 'success') {
                resolve(result);
            } else {
                reject(result);
            }
        })
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

const welcomeCustomerByPartner = async(phoneNumber, name, password) => {
    
    let param = {
        sender: process.env.SMS_SENDER_REG,
        route: 4,
        mobiles: '91' + phoneNumber,
        country: 91,
        authkey: process.env.SMS_AUTH_KEY,
        message: `Glad to have you with us ${name}. Download Zeaztzy bit.ly/xyz. Your password is ${password}. \nTeam RezApp`
    }   

    request.get({uri: process.env.SMS_HOST, qs: param}, function(err, response, body) {
        logger.info('Message sent successfully to ', phoneNumber);
    })

}

module.exports = { sendOTP, welcomeCustomer, verifyOTP, welcomeCustomerByPartner }