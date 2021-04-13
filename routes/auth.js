const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/add-user', authController.postAddUser);

router.get('/get-token/:f_id', authController.getToken)

router.post('/logout', authController.postLogout);

router.post('/logout-all-devices', authController.postLogoutAllDevices);

module.exports = router;