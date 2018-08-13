const logger = require('../../utils/logger');
const mongoose = require('mongoose');
const express = require('express');
const Partner = require('../../models/partners');
const partner = require('../../helper/partner');

const getRooms = async(req, res, next) => {

    try {
        
        const rooms = await partner.getRooms(req.body.partner.id);

        if (rooms === "ERROR") {
            throw new Error("No rooms found");
        }

        return res.status(200).json({
            code: 200,
            message: "Rooms available",
            rooms: rooms.rooms
        })

    } catch(err) {
        
        return res.status(200).json({
            code: 500,
            message: "No rooms available"
        })

    }

}

const getBookings = async(req, res, next) => {

    try {

        const partnerID = req.body.partner.id;

        logger.info("getBookings(): Finding bookings ", partnerID);

        const bookings = await partner.getBookings(partnerID);

        if (bookings === "NOPE") {
            throw new Error("No bookings found");
        }

        logger.info("getBookings(): Returning bookings " + bookings);

        return res.status(200).json({
            code: 200,
            message: "Booking fetched successfully",
            bookings: bookings
        })

    } catch(err) {

        logger.info("getBookings(): Error fetching bookings " + partnerID);

        return res.status(200).json({
            code: 500,
            message: "No bookings found"
        })

    }

}

module.exports = {
    getRooms,
    getBookings
}