const logger = require('../utils/logger');
const Catalog = require('../models/catalog');

const getCatalogItems = async(partnerID) => {

    try {

        logger.info(`getCatalogItems(): Returning catalog items for ${partnerID}`);

        const items = await Catalog.find({ partnerID: partnerID }, 'id name isNonVeg inStock').exec();

        if (!items) {
            throw new Error(items);
        }

        logger.info(`getCatalogItems(): Returning items for ${partnerID} : ${JSON.stringify(items)}`);

        return JSON.parse(JSON.stringify(items));

    } catch(err) {

        logger.info(`getCatalogItems(): Error fetching items for ${partnerID}: ${JSON.stringify(err)}`);

        return "ERROR";

    }

}

const toggleItemStock = async(itemID, partnerID, status) => {

    try {
        
        logger.info(`toggleItemStock(): Updating Item Status for ${itemID} - ${partnerID} => inStock : ${status}`);

        const itemStatus = await Catalog.findOneAndUpdate({ id: itemID, partnerID: partnerID }, {
            $set: {
                inStock: status
            }
        }).exec();

        if (!itemStatus) {
            throw new Error(itemStatus);
        } else {
            logger.info(`toggleItemStock(): Item status updated for ${itemID} - ${partnerID} => inStock : ${status}`);
            return "SUCCESS";
        }

    } catch(err) {

        logger.info(`toggleItemStock(): Error updating item status for ${itemID} - ${partnerID} => inStock : ${status} --- ${JSON.stringify(err)}`);

        return "ERROR"

    }

}

module.exports = {
    getCatalogItems,
    toggleItemStock
}