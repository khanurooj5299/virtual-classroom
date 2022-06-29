const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const resultSchema = mongoose.Schema({
    "studentId": ObjectId,
    "courseId": ObjectId,
    "year": Number,
    "subjects": [
        {
            "subjectId": ObjectId,
            "subjectName": String,
            "percentage": Number,
            "remarks": String
        }
    ]
});

const resultModel = mongoose.model('results', resultSchema);
module.exports = resultModel;