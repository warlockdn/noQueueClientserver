const RazorPay = require('razorpay');

let instance = new RazorPay({
    key_id: process.env.paymentkeyID,
    key_secret: process.env.keySecret
})

const getAllOrders = async() => {

    try {
        
        const orders = await instance.orders.all({
            from: 1528613795000,
            to: Date.now()
        })
    
        return orders;

    } catch(e) {
        return "ERROR";
    }

}

module.exports = {
    getAllOrders
}