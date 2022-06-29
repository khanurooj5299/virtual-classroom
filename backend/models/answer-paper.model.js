const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const answerPaperSchema = mongoose.Schema({
    "studentId": ObjectId,
    "questionPaperId": ObjectId,
    "responses": [
        {
            "questionId": ObjectId,
            "response": String
        }
    ]
});

const answerPaperModel = mongoose.model('answer-papers', answerPaperSchema);
module.exports = answerPaperModel;