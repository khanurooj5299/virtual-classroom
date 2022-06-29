const mongoose = require('mongoose');
const courseModel = require('../models/course.model');
const subjectModel = require('../models/subject.model');

exports.addSubject = (req, res) => {
    const subject = req.body;
    if(subject) {
        subjectModel.create(subject, (err, result)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            }
            else {
                res.json({status: 200, data: 'Subject added!'});
            }
        });
    }
    else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}

exports.removeSubject = (req, res) => {
    const subjectId = req.params['subjectId'];
    subjectModel.deleteOne({_id: subjectId}, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: 'error: DB operation failed'});
        }
        else {
            if(result.deletedCount == 0) {
                res.json({status: 400, data: 'No such subject exists!'});
            }
            else {
                res.json({status: 200, data: 'Subject successfully deleted.'});
            }
        }
    });
}

exports.updateSubject = (req, res)=>{
    const subjectId = req.params['subjectId'];
    const subject = req.body;
    if(subject) {
        subjectModel.replaceOne({_id: subject._id}, subject, (err, result)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            } else {
                if(result.modifiedCount>0) {
                    res.json({status: 200, data: 'update successful'});
                }
                else {
                    res.json({status: 400, data: 'no such subject exists'});
                }
            }
        });
    } else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}