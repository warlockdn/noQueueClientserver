const mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;
const { autoIncrement } = require('mongoose-plugin-autoinc')

// Initialize Auto Increment 
const connection = mongoose.createConnection(process.env.MONGO_CONNECT_URL);

const cartItemSchema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    hasAddons: { type: Boolean, default: false },
    isNonVeg: { type: Boolean, default: false },    
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    extras: [],
    quantities: []
})

const cartSchema = new Schema({
    id: { type: Number, unique: true, required: true },
    partnerID: { type: Number, index: true, required: true },
    partnerName: { type: String },
    customerID: { type: Number },
    cart: [ cartItemSchema ],
    createdOn: { type: Date, default: Date.now() },
    updatedOn: { type: Date, default: Date.now() },
    totalItems: { type: Number, required: true },
    total:  { type: Number, required: true },
    tax: { type: Number, default: 0 },
    commission: { type: Number },
    notes: { type: String },
    status: { type: String }, // In Cart (default), Paid, Accepted, Delivered
    room: { type: String },
    coupon: {
        couponID: { type: Number },
        couponCode: { type: String },
        amount: { type: Number }
    }
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

cartSchema.pre('update', (next, done) => {
    this.updatedOn = Date.now();
    next();
});

cartSchema.plugin(autoIncrement, {
    model: 'Cart',
    field: 'id',
    startAt: 10000,
    incrementBy: 1
});

const Cart = connection.model('Cart', cartSchema);

module.exports = Cart