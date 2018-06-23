const razor = require('../providers/razorPay/index');

const cart = ((req, res, next) => {});

const createCart = ((req, res, next) => {});

const updateCart = ((req, res, next) => {})

const getRazorOrders = async(req, res, next) => {
    
    const orders = await razor.getAllOrders();
    
    try {
        if (orders) {
    
            console.log("Orders: ", orders)
    
            return res.status(200).json({
                status: 200,
                message: "Done",
                orders: orders
            })
        }
    } catch(e) {

        return res.status(204).json({
            status: 204,
            message: 'No orders found'
        })
        
    }

}

module.exports = {
    getRazorOrders
}