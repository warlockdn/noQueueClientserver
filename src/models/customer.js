const crypto = require('crypto');
const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc')

// Initialize Auto Increment 
const connection = mongoose.createConnection("mongodb://localhost:27017/food");

const customerSchema = new mongoose.Schema({
    customerID: { type: Number, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true, },
    phone: { type: Number, index: true, unique: true, required: true },
    password: String,
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    totalSpent: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    isActive: {
        type: Boolean,
        default: true
    },
    
});

customerSchema.methods.validatePassword = (password, receivedPassword) => {
    
    const ENCRYPTION_KEY = process.env.PASSWORD_KEY;
    let textParts = password.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    if (decrypted.toString() === receivedPassword) return true;
    return false;

}

customerSchema.pre('update', function (next, done) {
    this.updatedOn = Date.now();
    next();
});

customerSchema.pre('save', function (next, done) {

    const ENCRYPTION_KEY = process.env.PASSWORD_KEY;
    const IV_LENGTH = 16;

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(this.password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    this.password = iv.toString('hex') + ':' + encrypted.toString('hex');
    this.createdOn = Date.now();
    next();
    
});

customerSchema.plugin(autoIncrement, {
    model: 'Customer',
    field: 'customerID',
    startAt: 3000500,
    incrementBy: 2
});

const Customer = connection.model('Customer', customerSchema);

module.exports = Customer;