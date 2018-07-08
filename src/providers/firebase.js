const logger = require('../utils/logger');
const fireAdmin = require('firebase-admin');

const config = require('./../../cert/resapp-1523718961807-firebase-adminsdk-1ppta-33429b6790.json');

fireAdmin.initializeApp({
    // credential: fireAdmin.credential.cert(config),
    credential: fireAdmin.credential.cert({
        "type": "service_account",
        "project_id": "resapp-1523718961807",
        "private_key_id": "33429b6790342954aefa0f44e054bece5681651c",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsDA8WfNUAp/+7\nxwYenLmClg3f+0JPL+RNVUsaRJI5R3KpL2bqjd0rC73+NmHWC5lPExj+F6uRDguA\nYizV4bJieWICfrju99suNdlsTXymXbKssncXQkRkOEkAsx3vBksn44C7KXldpcj8\ndTac/76nDbc0XHvLpo7d/huIgOLc7cjiPCDdNGyxJvSlznfOh6FvXBSrAnu5i0jD\nuVczpZ/DAL2nD0mdCzr/3yAeGPuXb2iTX26dAPjKS/j+dzma5cwSdC/OtOJ2qHQ/\nrmtpZ994h7CnIrJzIFmk/tzoFa6deE8D8q6FufE+gk+EIuv7vuuHP3ssxxFmp0E/\nKmsBNEPFAgMBAAECggEAAK0NdB+qcJW4ZgL6ra0c93vicxJYKNp90aX3pRNG5c23\nkB2dEGfdShmCNhj9mmsyP4LKMtlh9bBx8B+yoGaCHmvurCbWUC4OIOjaQVgumLK+\njHopCKDchu5HryaFBBbova/hphqcHPeVShSl0ckZdSuTIDQK0nqFji686fTjr02I\nOY3qupZxzkZizjSgQabNBPCkJPs74ubHas8O3WC92lQARIZWr+R2MINp2CZ+Byqf\npaSisJqPPnaC3DktWs8n8IKMIWjVUvhKPUqQ4kwomK7sIWmA5P1EsgnwQAvonhLh\nGGRCeku1U4mK4AbaMevM2MHkSRWlP+bPhf+2619c4QKBgQDZq44SsU4+zxycSBzO\ncDEvBMnpGY4r5wvuBlkoLPE/OKNY+D2YTXjRsLCzvGee+KJTRXh/4Q/mfkfXk18T\nEdhSLSpDI2NGLjOyBnGZCGPYWrobrcTrgb0nI+kR6v2rhzg1HAwS7PzL29vbkPLW\nTnkEB+EB0D6Svx2L8qs54G17EQKBgQDKV9gGterCSzt6E7IySeZusn01Y1ibPrK8\nFOM+AKJAqFXXfAKxlAWneFZU9H76iUaO01ZyOXTzdIYLz3gCwjT+8zhjBNSb+0tK\n14E+4TjTFFb2kVeB2ttPB6mjPJAk6AZFYVWWkhd+ne8dY02wfwx5Fj8dbIIyjaEl\nVTU1BKi1dQKBgErxSgUdjrcJT+xu15wr/IMXvvzGk7CB6BWXkfLHJniB45uqPGrH\noaVwlCYN5A9Tw2+wJ4C/2F2fdNTAJKfIKRaB/l8HPBLZrWrJ1Sq/PMEs247UEUyU\naq+jKYfFxHjeIXgHpBCQD6mQlO3PxgwLEJdWrx2UuTaFHoMklddjcc5BAoGBAJSW\nWV7kLBatpGmLGSpwtjTIAcY4xBKMwjf3psAbOwr8Er2ApYG9z0Ehz1Pnj29va07q\nxupuYwF8qgr2OYzdDInEFb4xB+fba3j0NEb2oQHwR8QdCwOisbWhTONAUCGp+SDt\nzyoY8gPa+oK8L4rSYVhyC7sRubJh6to9bisW1sUZAoGBALl8HJ/2Sk4kQIXvv4rc\nVtHhvZZod0P1dSyFFmQsA+KqHhHVm/B7kuMQhra/PmjupCgG7nkP1rzGcmTRTE+Q\nnfrmBOlW+B+CTskvHghZL+bCOEzj6qE7wylZTh6AeIm45dfMNzYBSvVXmEM6R3I+\njcmpLIw/cugpWzQCmytLsAJW\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-1ppta@resapp-1523718961807.iam.gserviceaccount.com",
        "client_id": "106709438541928610969",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1ppta%40resapp-1523718961807.iam.gserviceaccount.com"
    }),
    databaseURL: "https://resapp-1523718961807.firebaseio.com"
})

let db = fireAdmin.firestore()

const createOrderFirebase = async(order) => {

    let ref = db.collection("orders");

    try {

        order = JSON.parse(JSON.stringify(order));
        order.updatedOn = new Date(order.updatedOn);
        order.createdOn = new Date(order.createdOn);

        ref.add(order).then((order) => {
            return order;
        }).catch((err) => {
            throw new Error(err);
        })
        
        // let newOrder = await ref.add(order);
        
        // if (!newOrder.id) {
        //     throw new Error(newOrder);
        // } 


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
