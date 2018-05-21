const logger = require('../utils/logger');
const mongoose = require('mongoose');
const Partner = require('../models/partners');

const listNearyByPlaces = async(long, lat) => {

    const coordinates = [long, lat];

    try {
        const results = await Partner.find({
            location: {
                $near: {
                    $maxDistance: 500, // Meteres..
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    }
                }
            },
            isActive: true,
            isPending: false
            // , 
        }, 'partnerID name phone imageid basic location characteristics').exec();

        if (results !== null) {
            return results;
        } else {
            throw new Error('ERROR')
        }
    } catch(err) {
        return 'ERROR'
    }

};

const getPlaceMenu = async(partnerID) => {

    const query = { partnerID: partnerID };

    try {

        const partner = Partner.find(query, 'menu').exec();

    } catch(err) {

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

const getMenu = ((req, res, next) => {});

module.exports = {
    listNearyByPlaces,
    filterCuisines,
    filterServices,
    filterType
}