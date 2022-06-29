const mongoose = require('mongoose');
const courseModel = require('../models/course.model');
const subjectModel = require('../models/subject.model');
const ObjectId = mongoose.Types.ObjectId;

exports.addCourse = (req, res) => {
    const course = req.body;
    if(course) {
        //we will check duplicates using courseCode
        courseModel.exists({code: course.code}, (err, result)=>{
            if(err) {
                res.json({status: 500, data: 'error: DB operation failed'});
            }
            else {
                if(result) {
                    res.json({status: 400, data: 'course already exists!'});
                }
                else {
                    courseModel.create(course, (err, result)=>{
                        if(err) {
                            res.json({status: 500, data:'error: DB operation failed'});
                        }
                        else {
                            res.json({status: 200, data: 'Course added!'});
                        }
                    });
                }
            }
        });
    }
    else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}

exports.getCourses = (req, res) => {
    courseModel.find({}, (err, result) => {
        if (err) {
            res.json({ status: 500, data: 'error: db operation failed' });
        }
        else {
            res.json({ status: 200, data: result });
        }
    });
}

exports.getCourseNumber = (req, res) => {
    courseModel.estimatedDocumentCount((err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: 'error: DB operation failed'});
        } else {
            res.json({status: 200, data: result});
        }
    });
}

exports.getCoursesForCoursesComponent = (req, res) => {
    courseModel.find({}, {
        code: 1,
        name: 1,
        duration: 1,
        credits: 1
    }, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, data: 'error: DB operation failed' });
        }
        else {
            res.json({ status: 200, data: result });
        }
    });
}

exports.getCoursesForAdmitCardComponent = (req, res) => {
    courseModel.find({}, {
        name: 1,
        credits: 1
    }, (err, result) => {
        if (err) {
            res.json({ status: 500, data: 'error: db operation failed' });
        }
        else {
            res.json({ status: 200, data: result });
        }
    });
}

exports.getCoursesForStudentCoursesComponent = (req, res) => {
    courseModel.find({}, null,{
        limit: 12
    },
    (err, result) => {
        if (err) {
            res.json({ status: 500, data: 'error: db operation failed' });
        }
        else {
            if(result.length>3) {
                result = result.slice(0, result.length - (result.length%3))
            }
            res.json({ status: 200, data: result });
        }
    });
}

exports.searchCourses = (req, res) => {
    const searchValue = req.params['searchValue'];
    courseModel.find({$or: [
        {name: {$regex: `^${searchValue}.*`, $options: 'i'}},
        {code: {$regex: `^${searchValue}.*`, $options: 'i'}}
    ]}, (err, result) => {
        if(err) {
            res.json({ status: 500, data: 'error: db operation failed'});
        }
        else {
            res.json({ status: 200, data: result});
        }
    });
}

exports.getCourseAndSubjects = (req, res) => {
    const courseId = req.params['courseId'];
    courseModel.aggregate([
        {
            $match: {_id: ObjectId(courseId)}
        },
        {
            $lookup: {
                from: "subjects",
                localField: "_id",
                foreignField: "courseId",
                as: "subjects"
            }
        }
    ], (err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: 'error: DB operation failed'});
        }
        else {
            if(result.length) { //even if no document matches, an empty array is returned which evaluates to true
                res.json({status: 200, data: result[0]})
            }
            else {
                res.json({status: 400, data: 'error: no such course exists'});
            }
        }
    });
}

exports.getCourseSubjects = (req,res) => {
    const courseId = req.params['courseId'];
    subjectModel.find({courseId: courseId}, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({ status: 500, data: 'db operation failed' });
        }
        else {
            if(result) {
                res.json({ status: 200, data: result });
            }
            else {
                res.json({status: 400, data: 'no such course exists'});
            }
        }
    });
}

exports.getCourseSubjectsForSubjectsComponent = (req,res) => {
    const courseId = req.params['courseId'];
    subjectModel.find({courseId: courseId}, {
        name: 1,
        description: 1,
        requirements: 1,
        instructor: 1
    }, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({ status: 500, data: 'db operation failed' });
        }
        else {
            if(result) {
                res.json({ status: 200, data: result });
            }
            else {
                res.json({status: 400, data: 'no such course exists'});
            }
        }
    });
}

exports.updateCourse = (req, res)=>{
    const courseId = req.params['courseId'];
    const course = req.body;
    if(course) {
        courseModel.replaceOne({_id: course._id}, course, (err, result)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            } else {
                if(result.modifiedCount>0) {
                    res.json({status: 200, data: 'update successful'});
                }
                else {
                    res.json({status: 400, data: 'no such course exists'});
                }
            }
        });
    } else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}