const crypto = require('crypto');
const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc')

// Initialize Auto Increment 
const connection = mongoose.createConnection("mongodb://localhost:27017/food");

const transactionSchema = new mongoose.Schema({
    tid: { type: Number, index: true, unique: true },
    partnerID: { type: Number },
    name: { type: String, required: true },
    email: { type: String, index: true, unique: true, required: true, trim: true, lowercase: true, },
    phone: { type: Number, index: true, unique: true, required: true },
    password: String,
    imageid: String,
    phoneAlternate: { type: String },
    basic: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        state: { type: String, required: true } 
    },
    menu: [],
    location: {
        coordinates: {
            type: [Number],
            index: '2d',
            required: true
        },
        elevation: Number
    },
    characteristics: {
        "type": { type: String, required: true },
        typeid: { 
            /*  1 - QSR, 2 - Restaurant, 3 - Hotels  */
            type: String
        },
        services: [String],
        seating: { type: Boolean, default: false },
        cuisine: [String],
        weektiming: [String],
        opentime: { type: String, required: true },
        closetime: { type: String, required: true },
    },
    bankDetails: {
        accname: { type: String, required: true },
        number: { type: Number, required: true },
        bankname: { type: String, required: true },
        branch: { type: String, required: true },
        ifsc: { type: String, required: true },
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    isActive: {
        type: Boolean,
        default: false
    },
    isPending: {
        type: Boolean,
        default: true
    },
    commission: { type: Number, default: 8 },
    documents: []
});

const Partner = connection.model('Partner', transactionSchema);

module.exports = Partner;