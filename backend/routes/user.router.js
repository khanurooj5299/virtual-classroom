const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/register-user', userController.registerUser);

router.post('/login', userController.login);

router.get('/:userId/get-user', userController.getUser);

router.put('/:userId/change-password', userController.changePassword);

router.put('/:userId/update-user', userController.updateUser);

module.exports = router;