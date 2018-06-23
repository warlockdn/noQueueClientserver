const crypto = require('crypto');
const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc')

// Initialize Auto Increment 
const connection = mongoose.createConnection("mongodb://localhost:27017/food");

const transactionSchema = new mongoose.Schema({
    tid: { type: Number, index: true, unique: true },
    partnerID: { type: Number },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

const Partner = connection.model('Transaction', transactionSchema);

module.exports = Partner;