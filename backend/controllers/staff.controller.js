const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const subjectModel = require('../models/subject.model');
const questionPaperModel = require('../models/question-paper.model');

exports.addContentToSubject = (req, res) => {
    const subjectId = req.params['subjectId'];
    const content = req.body;
    if(content) {
        subjectModel.findByIdAndUpdate(subjectId, { $addToSet: {content: { $each: content}}}, (err, result)=>{
            if(err) {
                res.json({status: 500, data: 'db operation failed'});
            }
            else {
                if(result) {
                    res.json({status: 200, data: 'successfully added'});
                }
                else {
                    res.json({status: 500, data: 'no such subject exists'});
                }
            }
        });
    }
    else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}

exports.getSubjectContent = (req, res) => {
    const subjectId = req.params['subjectId'];
    const addedBy = req.params['addedBy'];
    subjectModel.aggregate([
        {
            $match: {_id: ObjectId(subjectId)} //aggregate method does not support auto-casting
        },
        {
            $project: {
                content: {
                    $filter: {
                        input: "$content",
                        as: "file",
                        cond: {$eq: ["$$file.addedBy", addedBy]}
                    }
                },
                _id: 0
            }
        }
    ], (err, result)=>{
        if(err) {
            res.json({status: 500, data: 'error: DB operation failed'});
            console.log(err);
        }
        else {
            //result is an array of all matched documents(1 in this case). Each element is a document having only content field
            res.json({status: 200, data: result[0].content});
        }
    });
}

exports.getSubjectContentForAdmitCardComponent = (req, res) => {
    const subjectId = req.params['subjectId'];
    const addedBy = req.params['addedBy'];
    subjectModel.aggregate([
        {
            $match: {_id: ObjectId(subjectId)} //aggregate method does not support auto-casting
        },
        {
            $project: {
                content: {
                    $map: {
                        input: {
                             $filter: {
                                input: "$content",
                                as: "file",
                                cond: {$eq: ["$$file.addedBy", addedBy]}
                            }
                        },
                        as: "file",
                        in: {
                            '_id': '$$file._id',
                            'fileName': '$$file.fileName'
                        }
                    }
                },
                _id: 0
            }
        }
    ], (err, result)=>{
        if(err) {
            res.json({status: 500, data: 'error: DB operation failed'});
            console.log(err);
        }
        else {
            //result is an array of all matched documents(1 in this case). Each element is a document having only content field
            res.json({status: 200, data: result[0].content});
        }
    });
}

exports.removeSubjectContent = (req, res) => {
    const subjectId = req.params['subjectId'];
    const fileId = req.params['fileId'];
    subjectModel.findByIdAndUpdate(subjectId, { $pull: { content: {_id: fileId }}}, (err, result)=>{
        if(err) {
                res.json({status: 500, data: 'db operation failed'});
            }
            else {
                if(result) {
                    res.json({status: 200, data: 'successfully removed'});
                }
                else {
                    res.json({status: 500, data: 'no such subject exists'});
                }
            }
    });
}

exports.questionPaperExists = (req, res) => {
    const queryObject = req.body;
    if(queryObject) {
        questionPaperModel.findOne(queryObject, (err, result)=>{
            if(err) {
                res.json({status: 500, data: 'error: DB operation failed'});
            }
            else {
                if(result) {
                    res.json({status: 400, data: {
                        mssg: 'question paper already set',
                        questionPaperId: result._id
                    }});
                }
                else {
                    res.json({status: 200, data: {mssg:'question paper does not exist'}});
                }
            }
        });
    }
    else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}

exports.setQuestionPaper = (req, res) => {
    const questionPaper = req.body;
    if(questionPaper) {
        questionPaperModel.create(questionPaper, (err, result)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            }
            else {
                res.json({status: 200, data: 'Question paper successfully added'});
            }
        });
    }
    else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}