const logger = require('../utils/logger');
const Transaction = require('../models/transaction');

const createTransaction = async(partnerID, customerID, source, amount, tax, commission) => {

    try {

        const payload = {
            partnerID: partnerID,
            partnerID: customerID,
            source: source,
            amount: amount,
            tax: tax,
            commission: commission
        }

        logger.info("createTransaction(): ", payload);

        const transaction = new Transaction(payload);
        const newTransaction = await transaction.save();

        if (newTransaction.id) {
            logger.info("createTransaction(): Transaction created ", newTransaction);
            return {
                id: newTransaction.id
            }
        } else {
            throw new Error(newTransaction);
        }

    } catch(err) {

        logger.info("createTransaction(): Error creating transaction ", err)
        return "ERROR";
    }

}

module.exports = {
    createTransaction
}