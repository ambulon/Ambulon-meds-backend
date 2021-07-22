const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/get-details', userController.getDetails);

router.post('/add-to-search',
    check('search')
        .matches(/^[a-z0-9 ]+$/i)
        .withMessage('invalid search query')
        .custom(value => {
            if (value === '') {
                throw new Error('search query required');
            }
            return true;
        }),
    userController.postAddtoSeach
);

router.post('/add-to-wishlist',
    check('medicineId')
        .isAlphanumeric()
        .withMessage('invalid medicine id')
        .custom(value => {
            if (value === '') {
                throw new Error('medicine id required');
            }
            return true;
        }),
    userController.postAddtoWishlist
);

router.post('/remove-from-wishlist',
    check('medicineId')
        .matches(/^[a-z0-9 ]+$/i)
        .withMessage('invalid medicine id')
        .custom(value => {
            if (value === '') {
                throw new Error('medicine id required');
            }
            return true;
        }),
    userController.postRemovefromWishlist
);

router.post('/clear-history', userController.postClearSearchHistory);

router.get('/get-cart', userController.getCart);

router.post('/add-to-cart',
    [
        check('medicineId')
            .matches(/^[a-z0-9 ]+$/i)
            .withMessage('invalid medicine id')
            .custom(value => {
                if (value === '') {
                    throw new Error('medicine id required');
                }
                return true;
            }),
        check('quantity')
            .custom(value => {
                if (parseInt(value) === NaN || value < 1) {
                    throw new Error('invalid quantity');
                }
                if (value === '') {
                    throw new Error('quantity required');
                }
                return true;
            }),
        check('char')
            .isAlpha()
            .withMessage('invalid char value')
            .custom(value => {
                if (value === '') {
                    throw new Error('char value required');
                }
                return true;
            })
    ],
    userController.postAddtoCart
);

router.post('/remove-from-cart',
    check('medicineId')
        .matches(/^[a-z0-9 ]+$/i)
        .withMessage('invalid medicine id')
        .custom(value => {
            if (value === '') {
                throw new Error('medicine id required');
            }
            return true;
        }),
    userController.postRemovefromCart
);

router.post('/clear-cart', userController.postClearCart);

router.post('/sync-cart',
    check('cart')
        .custom(value => {
            if (value === '') {
                throw new Error('cart object required');
            }
            return true;
        }),
    userController.postSyncCart
);

module.exports = router;