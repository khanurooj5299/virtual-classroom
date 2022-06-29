const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    "code": String,
    "name": String,
    "duration": String,
    "credits": Number,
    "description": String,
    "image": String,
    "requirements": [String],
    "learningObjectives": [String],
    "rating": Number,
    "detailedDescription": String
});

const  courseModel = mongoose.model('courses', courseSchema);

module.exports =  courseModel;