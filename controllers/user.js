const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Token = require('../models/token');
const Medicine = require('../models/medicine');

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