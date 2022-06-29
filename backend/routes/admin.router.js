const express = require('express');

const verifyJwt = require('../auth-middleware/verify-jwt');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/get-dashboard-data', verifyJwt, adminController.getDashBoardData);

router.get('/get-request-count', verifyJwt, adminController.getRequestCount);

router.put('/:staffId/change-staff-active-status', verifyJwt, adminController.changeStaffActiveStatus);

router.get('/get-requests', verifyJwt, adminController.getRequests);

router.post('/handle-requests', adminController.handleRequests);

module.exports = router;