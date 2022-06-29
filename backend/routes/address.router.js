const express = require('express');

const verifyJwt = require('../auth-middleware/verify-jwt');
const addressController = require('../controllers/address.controller');

const router = express.Router();

router.get('/get-countries', verifyJwt, addressController.getCountries);

router.get('/:countryId/get-states', verifyJwt, addressController.getStates);

router.get('/:stateId/get-cities', verifyJwt, addressController.getCities);

module.exports = router;