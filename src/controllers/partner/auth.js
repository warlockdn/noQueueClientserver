const logger = require('../../utils/logger');
const mongoose = require('mongoose');
const express = require('express');
const Partner = require('../../models/partners');
const jwtProvider = require('../../providers/token-generator');

const authenticate = async(req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    const type = "partner";

    try {

        let partner = await Partner.findOne({ partnerID: username }, ).exec();
    
        if (!partner) {
            throw new Error("Not found");
        }
        
        if (!partner.validatePassword(partner.password, password)) {
            throw new Error("Incorrect Credentials");
        } else {
            
            const payload = {
                partner: {
                    id: partner.partnerID,
                    name: partner.name,
                    email: partner.email,
                    phone: partner.phone
                },
                type: "Partner"
            }

            jwtProvider.generator(payload).then(
                (token) => {
                    return res.status(200).json({
                        status: 200,
                        message: "Success",
                        token: token,
                        partner: {
                            id: partner.partnerID,
                            name: partner.name,
                            email: partner.email,
                            phone: partner.phone
                        }
                    })
                }
            ).catch((err) => {
                throw new Error("Error creating token");
            })

        }


    } catch(err) {

        logger.info(err);

        if (err === "Not found") {
            return res.status(401).json({
                status: 401,
                message: "Partner not found"
            })
        } else if (err === "Incorrect Credentials") {
            return res.status(401).json({
                status: 401,
                message: "Incorrect Credentials"
            })
        } else {
            return res.status(401).json({
                status: 500,
                message: "Error"
            })
        }

    }
    
}

module.exports = {
    authenticate
}