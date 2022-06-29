const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const studentSchema = mongoose.Schema({
    "email": String,
    "courseId": ObjectId,
    "personalDetails" : {
        "firstname": String,
        "lastname": String,
        "gender": String,
        "dob": Date,
        "age": Number,
        "fathersname": String,
        "mothersname": String
    },
    "adddressDetails": {
        "current": {
            "houseNo": String,
            "city": String,
            "state": String,
            "pincode": String,
            "country": String
        },
        "permanent": {
            "houseNo": String,
            "city": String,
            "state": String,
            "pincode": String,
            "country": String
        }
    },
    "academicDetails": {
        "highestQualification": String,
        "secDetails": {
            "secBoard": String,
            "secMarksObtained": Number,
            "secMarksTotal": Number,
            "secPercentage": Number
        },
        "senSecDetails": {
            "senSecBoard": String,
            "senSecMarksObtained": Number,
            "senSecMarksTotal": Number,
            "senSecPercentage": Number
        },
        "gradDetails": {
            "gradBoard": String,
            "gradMarksObtained": Number,
            "gradMarksTotal": Number,
            "gradPrecentage": Number
        }
    },
    "images": {
        "signImg": String,
        "selfImg": String
    },
    "enrollDate": Date
});

const studentModel = mongoose.model('students', studentSchema);
module.exports = studentModel;