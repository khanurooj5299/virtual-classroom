const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const stateSchema = mongoose.Schema({
    "name": String,
    "countryId": ObjectId
});

const stateModel = mongoose.model('states', stateSchema);

module.exports = stateModel;