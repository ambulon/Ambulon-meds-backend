const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Token = require('../models/token');
const Medicine = require('../models/medicine');
const CartItem = require('../models/cart-item');

const { tokenSecret } = require('../util/config');

exports.getDetails = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findOne({ userId }).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        res.status(200).json({
            user
        });
    });
};

exports.postAddtoSeach = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findOne({ userId }).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const searchQuery = req.body.search;
        let searchHistory = user.search_history;
        searchHistory.push(searchQuery);
        if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(1, searchHistory.length);
        }
        res.status(200).json({
            message: 'added to history'
        });
    });
};

exports.postAddtoWishlist = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findOne({ userId }).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const medicine = req.body.medicine;
        let wishlist = user.wishlist;
        const new_medicine = new Medicine(medicine);
        const medicineId = await new_medicine.save()._id;
        wishlist.push(medicineId);
        res.status(200).json({
            message: 'added successfully'
        });
    });
};

exports.postRemovefromWishlist = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findOne({ userId }).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const medicineId = req.body.medicineId;
        let wishlist = user.wishlist;
        const new_wishlist = wishlist.filter((value, index, arr) => {
            return value === medicineId;
        });
        user.wishlist = new_wishlist;
        await user.save().catch(err => next(err));
        res.status(200).json({
            message: 'wishlist updated'
        });
    });
};

exports.postClearSearchHistory = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findOne({ userId }).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        user.searchHistory = [];
        await user.save().catch(err => next(err));
        res.status(200).json({
            message: 'added successfully'
        });
    });
};

exports.postAddtoCart = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findById(userId).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const name = req.body.name;
        const priceList = req.body.priceList;
        const quantity = req.body.quantity;
        const new_cartItem = new CartItem({
            userId,
            name,
            priceList,
            quantity
        });
        await new_cartItem.save().catch(err => next(err));
        res.json({
            message: 'Added to Cart'
        });
    });
};

exports.getCart = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findById(userId).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const cartItems = await CartItem.find({ userId }).exec().catch(err => next(err));
        const items = []
        const totalPrice = {
            netmeds: 0,
            _1mg: 0,
            apollo: 0
        };
        if (cartItems.length === 0) {
            res.json({
                items,
                totalPrice
            });
        }
        else {
            cartItems.forEach(item => {
                items.push({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.priceList
                });
                const price = item.priceList;
                totalPrice._1mg += price._1mg * item.quantity;
                totalPrice.netmeds += price.netmeds * item.quantity;
                totalPrice.apollo += price.apollo * item.quantity;
            });
            res.json({
                items,
                totalPrice
            });
        }
    });
};

exports.postRemovefromCart = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err);
            error.status = 401;
            return next(error);
        }
        const userId = decoded.userId;
        const fetched_token = await Token.findOne({ token }).exec().catch(err => next(err));
        if (!fetched_token) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const user = await User.findById(userId).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        const name = req.body.name;
        CartItem.findOneAndDelete({ name, userId })
            .then(result => {
                console.log(result);
                res.json({
                    message: 'removed successfully'
                });
            })
            .catch(err => next(err));
    });
};