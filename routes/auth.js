const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/add-user',
    [
        check('f_id')
            .isAlphanumeric()
            .withMessage('invalid firebase id')
            .custom(value => {
                if (!value) {
                    throw new Error('firebase id required');
                }
                return true;
            }),
        check('name')
            .matches(/^[a-z ]+$/i)
            .withMessage('invalid name')
            .custom(value => {
                if (!value) {
                    throw new Error('name required');
                }
                return true;
            }),
        check('email')
            .isEmail()
            .withMessage('invalid email')
            .custom(value => {
                if (!value) {
                    throw new Error('email required');
                }
                return true;
            }),
        check('age')
            .isNumeric()
            .withMessage('invalid age')
            .custom(value => {
                if (!value) {
                    throw new Error('age required');
                }
                if (value < 1 || value > 120) {
                    throw new Error('invalid age');
                }
                return true;
            })
    ],
    authController.postAddUser
);

router.get('/get-token/:f_id', authController.getToken)

router.post('/logout', authController.postLogout);

router.post('/logout-all-devices', authController.postLogoutAllDevices);

module.exports = router;