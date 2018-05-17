const mail = require('@sendgrid/mail');

const sendMenuUpdateNotification = (name, partnerID) => {

    const msg = {
        to: process.env.BUSINESS_EMAIL,
        from: process.env.NO_REPlY,
        subject: `Partner ${name} menu review pending`,
        text: `Partner ${name} menu pending for review`,
        html: 
        `Partner ${partnerID} (${name}) has updated menu and submitted for review. 
        <br/>`
    }

    mail.setApiKey(process.env.SENDGRID_KEY);

    mail.send(msg).then((success) => {
        console.log('Email Successfully Sent');
    }).catch((err) => {
        console.error('Email Sending Failed ', err)
    });

}

module.exports = {  }