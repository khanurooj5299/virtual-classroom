const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const studentModel = require('../models/student.model');
const answerPaperModel = require('../models/answer-paper.model');
const questionPaperModel = require('../models/question-paper.model');
const userModel = require('../models/user.model');
const resultModel = require('../models/result.model');

exports.getStudentNumber = (req, res)=>{
    studentModel.estimatedDocumentCount((err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: 'error: DB operation failed'});
        } else {
            res.json({status: 200, data: result});
        }
    });
} 

exports.isEnrolled = (req, res) => {
    const userId = req.params['userId'];
    const aggregateQuery = [
        //getting the user document
        {
            $match: { _id: ObjectId(userId)}
        },
        //performing a join with student collection using email
        {
            $lookup: {
                from: "students",
                localField: "email",
                foreignField: "email",
                as: "studentDocArray"
            }
        },
        {
            $project: { studentDocArray: 1, _id: 0}
        }
    ];
    userModel.aggregate(aggregateQuery, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: "error: DB operation failed"});
        } else {
            if(result.length) {
                if(result[0].studentDocArray.length) {
                    res.json({status: 200, data: {isEnrolled: true, enrolledCourseId: result[0].studentDocArray[0].courseId}}); //already enrolled
                } else {
                    //if studentDocArray is empty then $lookup stage did not find any doc
                    res.json({status: 200, data: {isEnrolled: false}}); //no enrollment
                }
            } else {
                //if result array is empty then first $match stage did not find any doc
                res.json({status: 400, data: "no such user"});
            }
        }
    });
}

exports.courseEnroll = (req, res) => {
    const student = req.body;
    if (student) {
        studentModel.exists({ email: student.email }, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 500, data: 'error: DB operation failed' });
            }
            else {
                if (result) {
                    res.json({ status: 400, data: 'You have already enrolled for a course' });
                }
                else {
                    studentModel.create(student, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.json({ status: 500, data: 'error: DB operation failed' });
                        }
                        else {
                            res.json({ status: 200, data: 'Enrollment successful' });
                        }
                    });
                }
            }
        });
    }
    else {
        res.json({ status: 500, data: 'error: no data passed' });
    }
}

exports.getStudent = (req, res) => {
    const email = req.params['email'];
    studentModel.findOne({ email: email }, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, data: 'error: DB operation failed' });
        }
        else {
            if (result) {
                res.json({ status: 200, data: result });
            }
            else {
                res.json({ status: 400, data: 'You have not enrolled for any course yet' });
            }
        }
    });
}

exports.answerPaperExists = (req, res) => {
    const queryObject = req.body;
    if(queryObject) {
        answerPaperModel.findOne(queryObject, (err, result)=>{
            if(err) {
                res.json({status: 500, data: 'error: DB operation failed'});
            }
            else {
                if(result) {
                    res.json({status: 400, data: 'Exam already given'});
                }
                else {
                    res.json({status: 200, data: 'answer paper does not exist'});
                }
            }
        });
    }
    else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}

exports.addAnswerPaper = (req, res) => {
    const answerPaper = req.body;
    const subjectName = answerPaper.subjectName;
    delete answerPaper.subjectName;
    if (answerPaper) {
        answerPaperModel.create(answerPaper, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 500, data: 'error: DB operation failed' });
            }
            else {
                questionPaperModel.findById(answerPaper.questionPaperId, (err, questionPaper)=>{
                    if(err) {
                        console.log(err);
                        res.json({status: 500, data: "error: DB operation failed"});
                    } else {
                        if(questionPaper) {
                            const result = resultManipulations(questionPaper, answerPaper);
                            const percentage = (result.correctResponses/result.totalQuestions)*100;
                            const remarks = percentage >=50 ? 'pass' : 'fail';
                            const query = {studentId: answerPaper.studentId, courseId: questionPaper.courseId, year: (new Date()).getFullYear()};
                            const update = {$addToSet: {subjects: {
                                subjectId: questionPaper.subjectId,
                                subjectName: subjectName,
                                percentage: percentage,
                                remarks: remarks
                            }}}
                            const options = { upsert: true };
                            resultModel.updateOne(query, update, options, (err, result)=>{
                                if(err) {
                                    console.log(err);
                                    res.json({status: 500, data: 'error: DB operation failed'});
                                } else {
                                    res.json({status: 200, data: 'Answer-paper saved'});
                                }
                            });
                        } else {
                            res.json({status: 400, data: "no such question paper exists"});
                        }
                    }
                });
            }
        });
    }
    else {
        res.json({ status: 500, data: 'error: no data passed' });
    }
}

exports.getQuestion = (req, res) => {
    const questionPaperId = req.params.questionPaperId;
    const skip = Number(req.params.skip);
    const query = {
        $match: { _id: ObjectId(questionPaperId) }
    }
    const projectQuery = {
        $project: { questions: 1, _id: 0 }
    }
    const aggregateQuery = [
        query,
        projectQuery,
        {
            $unwind: { path: "$questions" }
        },
        {
            $skip: skip
        },
        {
            $limit: 1
        }
    ]
    questionPaperModel.aggregate(aggregateQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, data: 'error: DB operation failed' });
        }
        else {
            if (result.length) {
                res.json({ status: 200, data: result[0].questions});
            }
            else {
                res.json({ status: 400, data: 'no such question' });
            }
        }
    });
}

exports.getResultCard = (req, res) => {
    const userId = req.params.userId;
    const courseId = req.body.courseId;
    const subjectId = req.body.subjectId;
    const year = req.body.year;

    let result = {};

    userModel.aggregate([
        //getting the user from users collection
        { 
            $match: {_id: ObjectId(userId)}
        },
        //adding studentDetails to user document using email as foreignKey
        {
            $lookup: {
                from: "students",
                localField: "email",
                foreignField: "email",
                as: "studentDetails"
            }
        },
        //cleaning up the document so we have a single field named studentDetails whose value is the student document
        {
            $project: {
                studentDetails: {
                    $first: "$studentDetails"
                },
                _id: 0
            }
        },
        //checking if the student has enrolled for the course she selected
        {
            $match: {"studentDetails.courseId": ObjectId(courseId)}
        },
        //this will add an array field named questionPapers to the input document which will have all question papers matching the registered courseId
        {
            $lookup: {
                from: "question-papers",
                localField: "studentDetails.courseId",
                foreignField: "courseId",
                as: "questionPapers"
            }
        },
        //filtering the questionPapers array to contain only that question paper for which result is to be provided
        {
            $project: {
                studentDetails: 1,
                questionPapers: {
                    $filter: {
                        input: "$questionPapers",
                        as: "questionPaper",
                        cond: {$and: [
                             {$eq:["$$questionPaper.subjectId",ObjectId(subjectId)]},
                             {$eq:["$$questionPaper.year", year]},
                            ]}
                    }
                }
            }
        },
        // //taking the question paper document from questionPapers array and adding it as a field
        {
            $project: {
                studentDetails: 1,
                questionPaper: {
                    $first: "$questionPapers"
                }
            }
        },
        //this will add an array field named answerPapers to the input document which will have all answer papers matching the questionPaperId
        {
            $lookup: {
                from: "answer-papers",
                localField: "questionPaper._id",
                foreignField: "questionPaperId",
                as: "answerPapers"
            }
        },
        //filtering the answerPapers array to contain only the students answer paper
        {
            $project: {
                studentDetails: 1,
                questionPaper: 1,
                answerPapers: {
                    $filter: {
                        input: "$answerPapers",
                        as: "answerPaper",
                        cond: {
                                $eq: ["$$answerPaper.studentId", "$studentDetails._id"]
                            }
                    }
                }
            }
        },
        //taking the answer paper document from answerPapers array and adding it as a field
        {
            $project: {
                studentDetails: 1,
                questionPaper: 1,
                answerPaper: {
                    $first: "$answerPapers"
                }
            }
        }
    ], (err, resultCard)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: "error: DB operation failed"});
        }
        else {
            if(resultCard.length) {
                resultCard = resultCard[0];
                if(resultCard.questionPaper) {
                    if(resultCard.answerPaper) {
                        res.json({status: 200, data: {
                            result: resultManipulations(resultCard.questionPaper, resultCard.answerPaper),
                            studentDetails: resultCard.studentDetails
                        }});
                    }
                    else {
                        res.json({status: 400, data: "you have not given any exam"});
                    }
                }
                else {
                    res.json({status: 400, data: "no such question paper exists"});
                }
            }
            else {
                res.json({status: 400, data: "no user exists/ student has not registered for selected course"});
            }
        }
    }); 
}

exports.getCertificate = (req, res) => {
    const userId = req.params.userId;
    const query = req.body; //this object has rollNo(entered studentId), year and courseName

    const aggregateQuery = [
        //getting the user
        {
            $match: {_id: ObjectId(userId)}
        },
        //adding student details to user document
        {
            $lookup: {
                from: "students",
                localField: "email",
                foreignField: "email",
                as: "studentDetails"
            }
        },
        //replacing the studentDetails array with the document. If studentDetails array is empty, $first does not return a value and studentDetails
        //field is removed
        {
            $set: {studentDetails: {$first: "$$ROOT.studentDetails"}}
        },
        //cleaning up. keeping only the student details
        {
            $project: {_id: 0, studentDetails: 1}
        },
        //adding all subjects of registered course
        {
            $lookup: {
                from: "subjects",
                localField: "studentDetails.courseId",
                foreignField: "courseId",
                as: "registeredCourseSubjects"
            }
        },
        //getting the result document. no need to match for both studentId and courseId as a student can enroll in only one course
        //but filtering is to be done for year field as wel which is done in the following stage
        {
            $lookup: {
                from: "results",
                localField: "studentDetails._id",
                foreignField: "studentId",
                as: "resultDocArray"
            }
        },
        //filtering for year
        {
            $set: {
                resultDocArray: {
                    $filter: {
                        input: "$$ROOT.resultDocArray",
                        as: "result",
                        cond: {$eq: ["$$result.year", query.year]}
                    }
                }
            }
        },
        //cleaning up, adding the subjects array from students' result document as resultSubjects field
        //if resulDocArray is empty, resultSubjects field is not added
        {
            $set: {
                resultSubjects: {$getField: {field: "subjects", input: {$first: "$$ROOT.resultDocArray"}}},
            }
        },
        {
            $project: {
                resultDocArray: 0
            }
        },
        //getting the registered course details
        {
            $lookup: {
                from: "courses",
                localField: "studentDetails.courseId",
                foreignField: "_id",
                as: "registeredCourse"
            }
        },
        //cleaning up: replacing the registeredCourse array by its first element
        {
            $set: {
                registeredCourse: {
                    $first: "$$ROOT.registeredCourse"
                }
            }
        }
    ];
    userModel.aggregate(aggregateQuery, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: "error: DB operation failed"});
        } else {
            if(result.length) {
                result = result[0];
                if(result.studentDetails) {
                    if(result.studentDetails._id.equals(query.rollNo)) {
                        if(result.registeredCourse) {
                            if(result.registeredCourse.name.toUpperCase()===query.course.toUpperCase()) {
                                if(result.registeredCourseSubjects.length) {
                                    if(!result.resultSubjects || result.registeredCourseSubjects.length!=result.resultSubjects.length) {
                                        res.json({status: 600, data: "You have not completed the course yet"});
                                    } else {
                                        res.json({status: 200, data: result});
                                    }
                                } else {
                                    res.json({status: 600, data: "Your registered course has no subjects"});
                                }
                            } else {
                                res.json({status: 400, data: "you have not registered for the entered course"});
                            }
                        } else {
                            res.json({status: 400, data: "no such course exists!"});
                        }
                    } else {
                        res.json({status: 400, data: "incorrect Roll Number"});
                    }
                } else {
                    res.json({status: 400, data: "no such student exists!"});
                }
            } else {
                //first $match stage failed
                res.json({status: 400, data: "no such user exists!"});
            }
        }
    });
}

function resultManipulations(questionPaper, answerPaper) {
    let result = {};
    result.totalQuestions = questionPaper.questions.length;
    result.attemptedQuestions = answerPaper.responses.length;
    const correctResponsesArray = answerPaper.responses.filter( response => {
        const matchedQuestion = questionPaper.questions.find(question => {
                        if(question._id.equals(response.questionId)&& question.correctOption === response.response) {
                            return true;
                        }
                        return false;
                    });
        return matchedQuestion;
    });
    result.correctResponses = correctResponsesArray.length;
    return result;
}