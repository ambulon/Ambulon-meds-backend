const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/get-details', userController.getDetails);

router.post('/add-to-search', userController.postAddtoSeach);

router.post('/add-to-wishlist', userController.postAddtoWishlist);

router.post('/clear-history', userController.postClearSearchHistory);

router.post('/remove-from-wishlist', userController.postRemovefromWishlist);

router.get('/get-cart', userController.getCart);

router.post('/add-to-cart', userController.postAddtoCart);

router.post('/remove-from-cart', userController.postRemovefromCart);

module.exports = router;