const countryModel = require('../models/address/country.model');
const stateModel = require('../models/address/state.model');
const cityModel = require('../models/address/city.model');

exports.getCountries = (req, res) => {
    countryModel.find({}, (err, result) => {
        if(err) {
            res.json({status: 500, dat: 'error: db operation failed'});
        }
        else {
            res.json({status: 200, data: result});
        }
    });
}

exports.getStates = (req, res) => {
    const countryId = req.params['countryId'];
    stateModel.find({countryId: countryId}, (err, result) => {
        if(err) {
            res.json({status: 500, dat: 'error: db operation failed'});
        }
        else {
            res.json({status: 200, data: result});
        }
    });
}

exports.getCities = (req, res) => {
    const stateId = req.params['stateId'];
    cityModel.find({stateId: stateId}, (err, result) => {
        if(err) {
            res.json({status: 500, dat: 'error: db operation failed'});
        }
        else {
            res.json({status: 200, data: result});
        }
    });
}