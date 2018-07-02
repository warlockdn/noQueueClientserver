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
        order.updatedOn = new Date(order.updatedOn);
        order.createdOn = new Date(order.createdOn);

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

const updateOrderStatusFirebase = async(docID, orderID, status) => {

    let updatedStatus = {
        stage: {
            placed: true,
            accepted: false,
            declined: false,
            ready: false
        }
    };

    if (status === "ACCEPTED") {
        updatedStatus = {
            stage: {
                placed: true,
                accepted: true,
                declined: false,
                ready: false
            }
        };
    } else if (status === "DECLINED") {
        updatedStatus = {
            stage: {
                placed: true,
                accepted: false,
                declined: true,
                ready: false,
                delivered: false
            }
        };
    } else if (status === "READY") {
        updatedStatus = {
            stage: {
                placed: true,
                accepted: true,
                declined: false,
                ready: true,
                delivered: false
            }
        };
    } else {
        updatedStatus = {
            stage: {
                placed: true,
                accepted: true,
                declined: false,
                ready: true,
                delivered: true
            }
        };
    }

    try {

        let ref = db.collection("orders");

        let status = await ref.doc(docID).update(updatedStatus);

        return status;

    } catch(err) {
        return "ERROR";
    }

}

module.exports = {
    createOrderFirebase,
    updateOrderStatusFirebase
}