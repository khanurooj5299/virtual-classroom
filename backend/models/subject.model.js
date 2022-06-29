const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const subjectSchema = mongoose.Schema({
    "name": String,
    "requirements": String,
    "instructor": String,
    "courseId": ObjectId,
    "description": String,
    "content": [
        {
            "file": String,
            "fileName": String,
            "addedBy": String
        }
    ]
});

const subjectModel = mongoose.model('subjects', subjectSchema);
module.exports = subjectModel;