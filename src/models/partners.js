const crypto = require('crypto');
const mongoose = require('mongoose').set('debug', true);
const { autoIncrement } = require('mongoose-plugin-autoinc')

// Initialize Auto Increment 
const connection = mongoose.createConnection("mongodb://localhost:27017/food");

const partnerSchema = new mongoose.Schema({
    partnerID: { type: Number, index: true, unique: true },
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

partnerSchema.index({
    location: "2dsphere"
});

const Partner = connection.model('Partner', partnerSchema);

module.exports = Partner;