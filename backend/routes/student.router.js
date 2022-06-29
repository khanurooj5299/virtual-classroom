const express = require('express');

const verifyJwt = require('../auth-middleware/verify-jwt');
const studentController = require('../controllers/student.controller');

const router = express.Router();

router.get('/get-student-number', verifyJwt, studentController.getStudentNumber);

router.get('/:userId/is-enrolled', verifyJwt, studentController.isEnrolled);

router.post('/course-enroll', verifyJwt, studentController.courseEnroll);

router.get('/:email/get-student', verifyJwt, studentController.getStudent);

router.post('/answer-paper-exists', verifyJwt, studentController.answerPaperExists);

router.post('/add-answer-Paper', verifyJwt, studentController.addAnswerPaper);

router.get('/:questionPaperId/get-question/:skip', verifyJwt, studentController.getQuestion);

router.post('/:userId/get-result-card', verifyJwt, studentController.getResultCard);

router.post('/:userId/get-certificate', verifyJwt, studentController.getCertificate);

module.exports = router;