const express = require('express');

const verifyJwt = require('../auth-middleware/verify-jwt');
const staffController = require('../controllers/staff.controller');

const router = express.Router();

router.post('/:subjectId/add-content-to-subject', verifyJwt, staffController.addContentToSubject);

router.get('/:subjectId/get-subject-content-for-admit-card-component/:addedBy', verifyJwt, staffController.getSubjectContentForAdmitCardComponent);

router.get('/:subjectId/remove-subject-content/:fileId', verifyJwt, staffController.removeSubjectContent);

router.post('/set-question-paper', verifyJwt, staffController.setQuestionPaper);

router.post('/question-paper-exists', verifyJwt, staffController.questionPaperExists);

module.exports = router;

