const logger = require('../utils/logger');
const mongoose = require('mongoose');
const helper = require('../utils/helpers');
const Partner = require('../models/partners');
const Customer = require('../models/customer');
const Catalog = require('../models/catalog');

const listNearyByPlaces = async(long, lat) => {

    const coordinates = [long, lat];

    try {
        const results = await Partner.find({
            location: {
                $near: {
                    $maxDistance: 700, // Meteres..
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    }
                }
            },
            isActive: true,
            isPending: false,
            'characteristics.typeid': { $in: [1, 2] }
            // , 
        }, 'partnerID name phone imageid partnerbg basic commission location characteristics tax taxInfo').exec();

        /* const results = await Partner.aggregate.near({
            near: coordinates,
            distanceField: 'dist.calculated',
            maxDistance: 500,
            query: {
                isActive: true,
                isPending: false
            },

        }) */

        if (results !== null) {

            let newResults = JSON.parse(JSON.stringify(results));

            newResults.forEach(partner => {
                partner.distance = parseFloat(helper.calculateDistance(lat, long, partner.location.coordinates[1], partner.location.coordinates[0])).toFixed(3)
            });

            logger.info(newResults);
            return newResults;
        } else {
            throw new Error('ERROR')
        }
    } catch(err) {
        return 'ERROR'
    }

};

const partnerDetail = async(partnerID) => {
    try {

        const partner = await Partner.findOne({ partnerID: partnerID }, 'partnerID commission taxInfo').exec();

        if (partner.id) {
            logger.info("partnerDetail(): Partner found ", partner);
            return JSON.parse(JSON.stringify(partner));
        } else {
            throw new Error(partner);
        }

    } catch(err) {
        logger.info("partnerDetail(): Partner error ", err);
        return "ERROR";
    }
}

const getPartner = async(partnerID) => {

    try {

        const partner = await Partner.findOne({ partnerID: partnerID }, 'partnerID name phone imageid basic commission location characteristics tax taxInfo').exec();

        if (partner) {
            logger.info("getPartner(): Partner found ", partner);
            return JSON.parse(JSON.stringify(partner));
        } else {
            throw new Error(partner);
        }

    } catch(err) {
        logger.info("getPartner(): Partner error ", err);
        return "ERROR";
    }

}

const getMenu = async(partnerID) => {

    try {

        const items = await getPlaceMenu(partnerID);
        const collection = await getCollection(partnerID);

        // Menu not found
        if (items === "ERROR" || collection === "ERROR") {
            throw new Error('err');
        }

        // Converting the array of items to Object. 
        let modItems = {};
        items.forEach(item => {
            modItems[item.id] = item;
        });

        logger.info('Returning Menu & Collections + ' + items + '\n' + collection);

        return {
            items: modItems,
            collection: collection.menu
        }

    } catch(err) {

        return "ERROR";

    }

}

const getPlaceMenu = async(partnerID) => {

    const query = { partnerID: partnerID };

    try {

        const menu = await Catalog.find(query).exec();

        if (!menu) {
            throw new Error("ERROR");
        } else {
            return menu
        }

    } catch(err) {
        return "ERROR";
    }

}

const getCollection = async(partnerID) => {
    
    const query = { partnerID: partnerID };

    try {

        const collection = await Partner.findOne(query, 'menu').exec();

        if (!collection) {
            throw new Error('ERROR');
        } else {
            return collection;
        }

    } catch(err) {
        return "ERROR";
    }
}

const filterCuisines = async(list) => {

    let cuisines = [];

    try {

        if (!list) {
            throw new Error('error');
        }
        
        list.map((item) => {
            item.characteristics.cuisine.map((cuisine) => {
                cuisines.push(cuisine);
            })
        })

        // Return unique
        cuisines = [...new Set(cuisines)];

        return await cuisines;

    } catch(err) {
        return 'ERROR';
    }
};

const filterServices = async(list) => {

    let services = [];

    try {

        if (!list) {
            throw new Error('error');
        }
        
        list.map((item) => {
            item.characteristics.services.map((service) => {
                services.push(service);
            })
        })

        // Return unique
        services = [...new Set(services)];

        return await services;

    } catch(err) {
        return 'ERROR';
    }
}

const filterType = async(list) => {

    let type = [];

    try {

        if (!list) {
            throw new Error('error');
        }
        
        list.map((item) => {
            type.push(item.characteristics.type);
        })

        // Return unique
        type = [...new Set(type)];

        return await type;

    } catch(err) {
        return 'ERROR';
    }
}

const getPlaceDetails = ((req, res, next) => {});

const getRooms = async(partnerID) => {

    try {

        const rooms = await Partner.findOne({ partnerID: partnerID, isActive: true, isPending: false, "characteristics.typeid": "3" }, 'rooms').exec();
        
        if (!rooms) {
            throw new Error("No rooms available.")
        } 

        return rooms;

    } catch(err) {

        return "ERROR";

    }

}

const getBookings = async(partnerID) => {

    try {

        const bookings = await Customer.find({ "checkIn.partnerID": partnerID, isCheckedIn: true }, 'name customerID checkIn').exec();

        if (!bookings) {
            throw new Error(bookings);
        } else {

            let newBookings = [];
            bookings.forEach((booking) => {
                newBookings.push({
                    name: booking.name,
                    customerID: booking.customerID,
                    partnerID: booking.checkIn.partnerID, 
                    room: booking.checkIn.room,
                    checkInTime: booking.checkIn.checkInTime,
                    checkOutTime: booking.checkIn.checkOutTime
                });
            })

            logger.info("getBookings(): Returning " + newBookings);

            return newBookings;
        }


    } catch(err) {

        logger.info("No results found ", err);
        return "NOPE";

    }

}

module.exports = {
    listNearyByPlaces,
    partnerDetail,
    filterCuisines,
    filterServices,
    filterType,
    getPlaceMenu,
    getCollection,
    getPartner,
    getMenu,
    getRooms,
    getBookings
}