const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const questionPaperSchema = mongoose.Schema({
    "year": Number,
    "subjectId": ObjectId,
    "courseId": ObjectId,
    "questions": [{
        "question": String,
        "options": [String],
        "correctOption": String
    }]
});

const questionPaperModel = mongoose.model('question-papers', questionPaperSchema);
module.exports = questionPaperModel;