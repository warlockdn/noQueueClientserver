const logger = require('../utils/logger');
const fireAdmin = require('firebase-admin');

const config = require('./../../cert/resapp-1523718961807-firebase-adminsdk-1ppta-33429b6790.json');

fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert(config),
    databaseURL: "https://resapp-1523718961807.firebaseio.com"
})

let db = fireAdmin.firestore();

db.settings({
    timestampsInSnapshots: true
})

fireAdmin.firestore.setLogFunction(console.log);

console.log(fireAdmin.firestore.Timestamp.now());

const createOrderFirebase = async(order) => {

    let ref = db.collection("orders");

    try {

        order = JSON.parse(JSON.stringify(order));
        order.updatedOn = fireAdmin.firestore.Timestamp.now();
        order.createdOn = fireAdmin.firestore.Timestamp.now();

        logger.info(`Inserting order to Firebase ${JSON.stringify(order)}`);

        /* return new Promise((resolve, reject) => {
            ref.add(order).then((order) => {
                logger.info(order);
                resolve(order);
            }).catch((err) => {
                logger.info(err);
                reject(err);
            })
        }) */
        
        let newOrder = await ref.add(order);

        /* const orderID = (order.id).toString();

        let newOrder = await db.collection("orders").doc(orderID).set(order); */
        
        if (!newOrder) {
            throw new Error(newOrder);
        } 

        logger.info("Updated order status" + newOrder);

        return newOrder;

    } catch(err) {

        logger.info("Error creating order" + err);
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

    updatedStatus.updatedOn = fireAdmin.firestore.Timestamp.now(); //new Date();

    try {

        let ref = db.collection("orders");

        /* return new Promise((resolve, reject) => {
            ref.doc(docID).update(updatedStatus).then((status) => {
                resolve(status)
            }).then((err) => {
                reject(err)
                throw new Error(err);
            })
        }) */

        logger.info("updateOrderStatusFirebase(): Setting order status in firebase for " + docID + " " + JSON.stringify(updatedStatus));
        
        let status = await ref.doc(docID).update(updatedStatus);

        logger.info(status);

        return status;

    } catch(err) {

        logger.info(`updateOrderStatusFirebase() Error updating order status ${orderID} - ${docID} -> ${err}`);

        return "ERROR";
    }

}

module.exports = {
    createOrderFirebase,
    updateOrderStatusFirebase
}
