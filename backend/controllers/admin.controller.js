const courseModel = require('../models/course.model');
const userModel = require('../models/user.model');
const sgMail = require('@sendgrid/mail');
const generator = require('generate-password');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.getDashBoardData = (req, res) => {
    const aggregateQuery = [
        //counting the number of courses
        {
            $count: 'courseCount'
        },
        //counting number of registered students
        {
            $unionWith: {
                coll: "students",
                pipeline: [
                    {
                        $facet: {
                            registeredStudentCount: [{$count: 'registeredStudentCount'}],
                            //getting all staff documents
                            studentBarChartData: [
                                { 
                                    $project: {
                                        enrollDate: {$substrBytes: [ "$enrollDate", 3, 2 ]},
                                        _id: 0
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$enrollDate",
                                        studentCount: { $count:{}}
                                    }
                                },
                                {
                                    $sort: { _id: 1}
                                }
                            ]
                        }
                    },
                    //cleaning up
                    {
                        $addFields: {
                            registeredStudentCount: {$getField: {field: "registeredStudentCount", input: {$first: "$$ROOT.registeredStudentCount"}}}
                        }
                    }
                ]
            }
        },
        {
            $unionWith: {
                coll: "users",
                pipeline : [
                    {
                        $facet: {
                            //couting the number of students and staff (exclude admins from active users)
                            activeUserCount: [ 
                                { $match: { roleId: { $in: [2,3]}}},
                                { $count: "activeUserCount" } 
                            ],
                            //counting the number of staff
                            staffCount: [
                                { $match: { roleId: 2}},
                                { $count: "staffCount"}
                            ],
                            //getting all staff documents which are approved 
                            staffDocs: [
                                { $match: { roleId: 2, isApproved: true} },
                                { $project: { name: 1, isActive: 1} }
                            ]
                        }
                    },
                    //cleaning up
                    {
                        $addFields: {
                            activeUserCount: {$getField: {field: "activeUserCount", input: {$first: "$$ROOT.activeUserCount"}}},
                            staffCount: {$getField: {field: "staffCount", input: {$first: "$$ROOT.staffCount"}}}
                        }
                    }
                ]
            }
        },
        //merging all documents into a single document in the form of a field called mergedData
        {
            $group: { _id:null , mergedData: { $mergeObjects: "$$ROOT" }}
        },
        //replacing the document with the mergedData field
        {
            $replaceRoot: {newRoot: "$mergedData"}
        }
    ];
    courseModel.aggregate(aggregateQuery, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: 'error: DB operation failed'});
        } else {
            result = result[0];
            // if students,users or courses collection is empty, count=0 field is not added in aggregation pipeline, so adding manually
            if(!result.courseCount) {
                result.courseCount = 0;
            }
            if(!result.registeredStudentCount) {
                result.registeredStudentCount = 0;
            }
            if(!result.activeUserCount) {
                result.activeUserCount = 0;
            }
            if(!result.staffCount) {
                result.staffCount = 0;
            }
            if(!result.staffRegisterRequests) {
                result.staffRegisterRequests = 0;
            }
            //changing month numbers to names
            result.studentBarChartData.forEach((month)=>{
                switch(month._id) {
                    case '01': 
                        month._id = 'Jan';
                        break;
                    case '02':
                        month._id = 'Feb';
                        break;
                    case '03':
                        month._id = 'Mar';
                        break;
                    case '04':
                        month._id = 'Apr';
                        break;
                    case '05':
                        month._id = 'May';
                        break;
                    case '06':
                        month._id = 'Jun';
                        break;
                    case '07':
                        month._id = 'Jul';
                        break;
                    case '08':
                        month._id = 'Aug';
                        break;
                    case '09':
                        month._id = 'Sep';
                        break;
                    case '10':
                        month._id = 'Oct';
                        break;
                    case '11':
                        month._id = 'Nov';
                        break;
                    case '12':
                        month._id = 'Dec';
                        break;
                }
            });
            res.json({status: 200, data: result})
        }
    })
}

exports.getRequestCount = (req, res) => {
    userModel.countDocuments({ isApproved: false}, (err, result)=>{
        if(err) {
            console.log(err);
        } else {
            res.json({status: 200, data: result});
        }
    });
}

exports.changeStaffActiveStatus = (req, res) => {
    const staffId = req.params['staffId'];
    const newActiveStatus = req.body['newActiveStatus'];
    if(req.body) {
        userModel.updateOne({_id: staffId}, {$set: {isActive: newActiveStatus}}, (err, result)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            } else {
                if(result) {
                    res.json({status: 200, data: 'Status successfully changed!'});
                } else {
                    res.json({status: 400, data: 'no such staff exists'});
                }
            }
        });
    } else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}

exports.getRequests = (req, res) => {
    userModel.find({isApproved: false}, {image: 1, name: 1, _id:1}, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: "error: DB operation failed"});
        } else {
            res.json({status: 200, data: result});
        }
    });
}

exports.handleRequests = (req, res) => {
    //this should be an array of userID's that admin should approve or decline(decided by value of isApproved)
    const requestsToHandle = req.body['requestsToHandle'];
    const isApproved = req.body['isApproved'];
    if(isApproved!=undefined && requestsToHandle) { //needed because isApproved is boolean
    if(isApproved) {
        /*will use for instead of forEach because in case of error in any iteration we need to break out of the loop because res cannot be 
        sent more than once*/
        for(const userId of requestsToHandle) {
            //generating the password
            const password = generator.generate({
                length: 10,
                numbers: true
            });
            //hashing the password
            bcrypt.hash(password, saltRounds, (err, hash)=>{
                if(err) {
                    console.log(err);
                    res.json({status: 500, data: 'Request could not be approved'});
                }
                else {
                    //setting isApproved to true and adding the hash value of password to userDoc
                    const updateQuery = {
                        $set: {
                            "isApproved": true,
                            "password": hash
                        }
                    };
                    userModel.findByIdAndUpdate(userId, updateQuery, (err, updatedUser)=>{
                        if(err) {
                            console.log(err);
                            res.json({status: 500, data: 'Request could not be approved'});
                        } else {
                            if(updatedUser) {
                                //finally sending the email containing credentials to user
                                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                const mssg = {
                                    to: "khanurooj5299@gmail.com",//??
                                    from: "khanurooj5299@gmail.com",
                                    subject: "Virtual Classroom Credentials",
                                    text: `Registraion successful. Your password is ${password}`
                                }
                                sgMail.send(mssg).then(()=>{
                                    //email successfully sent
                                    res.json({status: 200, data: `User approved. Password has been sent to ${updatedUser.email}`});
                                }, error=>{
                                    //when email could not be sent we need to remove the updates made to user
                                    // console.log(error);
                                    // const updateQuery = {
                                    //     $set: {
                                    //         "isApproved": false
                                    //     },
                                    //     $unset: {
                                    //         "password": ""
                                    //     }
                                    // }
                                    // userModel.updateOne({_id: userId}, updateQuery, (err, result)=>{
                                    //     if(err) {
                                        //probability of this error is very low
                                        //but if it happens then that is a problem 
                                        //because user didn't get email and the changes to user doc could not be reverted
                                    //         console.log(err);
                                    //         res.json("");
                                    //     } else {
                                    //         res.json({status: 400, data: "Email could not be sent while approving request"});
                                    //     }
                                    // });
                                    res.json({status: 200, data: `User approved. Password has been sent to ${password}`});//remove this when apikey valid
                                }); 
                            } else {
                                res.json({status: 400, data: "no such user exists"});
                            }
                        }
                    });
                }
            });//-------------
        }
    } else {
        //if requests are not approved then user documents are deleted from collection
        for(const userId of requestsToHandle) {//?change
            userModel.deleteOne({_id: userId}, (err, result)=>{
                if(err) {
                    console.log(err);
                    res.json({status: 500, data: "request could not be deleted"});
                } else {
                    if(result.deletedCount) {
                        res.json({status: 200, data: "Request declined"});
                    } else {
                        res.json({status: 400, data: "no such user exists"});
                    }
                }
            });
        }
    }
    } else {
        res.json({status: 500, data: "no data sent"});
    }
}