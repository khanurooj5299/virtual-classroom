const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const citySchema = mongoose.Schema({
    "name": String,
    "stateId": ObjectId
});

const cityModel = mongoose.model('cities', citySchema);

module.exports = cityModel;