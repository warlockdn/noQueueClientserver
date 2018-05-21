const express = require('express');
const router = express.Router();
const partner = require('../controllers/partner');

router.route('/listPlaces')
    .get(partner.listPlacesByLongLat);


module.exports = router;
