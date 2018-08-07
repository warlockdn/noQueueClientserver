const express = require('express');
const router = express.Router();
const partner = require('../controllers/partner');

router.route('/listPlaces')
    .get(partner.listPlacesByLongLat);

router.route('/:partnerID')
    .get(partner.getPartnerDetail);

router.route('/menu/:partnerID')
    .get(partner.getPlaceMenu);


module.exports = router;
