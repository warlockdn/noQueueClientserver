const logger = require('../utils/logger');
const fireAdmin = require('firebase-admin');

const config = require('./../../cert/resapp-1523718961807-firebase-adminsdk-1ppta-33429b6790.json');

fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert(config),
    databaseURL: "https://resapp-1523718961807.firebaseio.com"
})

let db = fireAdmin.firestore()

const createOrderFirebase = async(order) => {

    let ref = db.collection("orders");

    try {

        order = JSON.parse(JSON.stringify(order));

        let newOrder = await ref.add(order);
        
        if (!newOrder.id) {
            throw new Error(newOrder);
        } 

        return newOrder;

    } catch(err) {

        logger.log("Error creating order", err);
        return "ERR";

    }

}

module.exports = {
    createOrderFirebase
}
