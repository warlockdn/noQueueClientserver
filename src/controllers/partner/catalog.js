const logger = require('../../utils/logger');
const express = require('express');
const catalogHelper = require('../../helper/catalog');

const getItems = async(req, res, next) => {

    const partnerID = req.body.partner.id;

    try {
        
        logger.info(`getItems(): Fetching items for ${partnerID}`);

        const items = await catalogHelper.getCatalogItems(partnerID);

        if (items === "ERROR") {
            return res.status(200).json({
                code: 500,
                message: "Error fetching items"
            });
        } 

        return res.status(200).json({
            code: 200,
            items: items,
            message: "Items fetched successfully"
        })

    } catch(err) {

        logger.info(`getItems(): Technical error while fetching items for ${partnerID} ${err}`);

        return res.status(500).json({
            code: 500,
            message: "Technical error"
        })

    }


}

const toggleStock = async(req, res, next) => {

    const itemID = req.body.id;
    const partnerID = req.body.partner.id;
    const status = req.body.status;

    try {
        
        logger.info(`toggleStock(): Received request for ${itemID} -> ${status}`);

        const updatedStatus = await catalogHelper.toggleItemStock(itemID, partnerID, status);

        if (updatedStatus === "ERROR") {

            logger.info(`toggleStock(): Error processing request for ${itemID} -> ${status}`);

            return res.status(200).json({
                code: 500,
                message: "Error updating item status"
            });

        } else {

            logger.info(`toggleStock(): Status updated successfully for ${itemID} -> ${status}`);

            return res.status(200).json({
                code: 200,
                message: "Item status updated successfully"
            });

        }

    } catch(err) {

        logger.info(`toggleStock(): Unknown error occured ${itemID} -> ${status}`);

        return res.status(500).json({
            code: 500,
            message: "Technical error"
        });

    }

}

module.exports = {
    getItems,
    toggleStock
}