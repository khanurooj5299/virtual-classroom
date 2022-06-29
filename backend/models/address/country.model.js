const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    "name": String
});

const countryModel = mongoose.model('countries', countrySchema);

module.exports = countryModel;