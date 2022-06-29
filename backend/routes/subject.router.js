const express = require('express');

const verifyJwt = require('../auth-middleware/verify-jwt');
const subjectController = require('../controllers/subject.controller');

const router = express.Router();

router.post('/add-subject', verifyJwt, subjectController.addSubject);

router.delete('/:subjectId/remove-subject', verifyJwt, subjectController.removeSubject);

router.put('/:subjectId/update-subject', verifyJwt, subjectController.updateSubject);

module.exports = router;