const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc')

// Initialize Auto Increment 
const connection = mongoose.createConnection(process.env.MONGO_CONNECT_URL);

const transactionSchema = new mongoose.Schema({
    tid: { type: Number, index: true, unique: true },
    partnerID: { type: Number },
    customerID: { type: Number },
    source: {
        channel: { type: String },
        orderID: { type: String },
        paymentID: { type: String },
    },
    amount: { type: Number, required: true },
    commission: { type: Number },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

transactionSchema.pre('update', (next, done) => {
    this.updatedOn = Date.now();
    next();
});

transactionSchema.plugin(autoIncrement, {
    model: 'Transaction',
    field: 'tid',
    startAt: 10000,
    incrementBy: 1
});

const Transaction = connection.model('Transaction', transactionSchema);

module.exports = Transaction;