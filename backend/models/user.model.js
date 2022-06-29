const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    roleId: Number,
    isActive: Boolean,
    isApproved: Boolean,
    contact: String,
    password: String,
    image: String
});

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;