const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Token = require('../models/token');
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
        const user = await User.findById(userId).exec().catch(err => next(err));
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
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
        const medId = req.body.medicineId;
        let wishlist = user.wishlist;
        wishlist.push(medId);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
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
        const medicineId = req.body.medicineId;
        const wishlist = user.wishlist;
        const new_wishlist = wishlist.filter(value => value != medicineId);
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
        const user = await User.findById(userId).exec().catch(err => next(err));
        if (!user) {
            const err = new Error('invalid token');
            err.status = 401;
            return next(err);
        }
        user.searchHistory = [];
        await user.save().catch(err => next(err));
        res.status(200).json({
            message: 'history cleared'
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
        const items = [];
        const totalPrice = {
            _1mg: 0,
            apollo: 0,
            netmeds: 0
        };
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const char = item.char;
            const id = item.medicineId;
            const Medicine = require(`../models/medicine_${char}`);
            const fetched_med = await Medicine.findById(id).exec().catch(err => next(err));
            const priceList = {
                _1mg: fetched_med._1mg,
                apollo: fetched_med.apollo,
                netmeds: fetched_med.netmeds
            };
            const new_item = {
                medicineId: id,
                name: fetched_med.name,
                quantity: item.quantity,
                price: priceList
            };
            items.push(new_item);
            if (priceList._1mg !== -1) {
                totalPrice._1mg += item.quantity * priceList._1mg;
            }
            if (priceList.apollo !== -1) {
                totalPrice.apollo += item.quantity * priceList.apollo;
            }
            if (priceList.netmeds !== -1) {
                totalPrice.netmeds += item.quantity * priceList.netmeds;
            }
        }
        res.json({
            items,
            totalPrice
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
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
        const medicineId = req.body.medicineId;
        const check = await CartItem.findOne({ medicineId, userId }).exec().catch(err => next(err));
        if (check) {
            const err = new Error('item already in cart');
            err.status = 412;
            return next(err);
        }
        const char = req.body.char;
        const quantity = req.body.quantity;
        const new_cartItem = new CartItem({
            userId,
            medicineId,
            char,
            quantity
        });
        await new_cartItem.save().catch(err => next(err));
        res.json({
            message: 'Added to Cart'
        });
    });
};

exports.postRemovefromCart = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
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
        const medicineId = req.body.medicineId;
        CartItem.findOneAndDelete({ medicineId, userId })
            .then(() => {
                res.json({
                    message: 'removed successfully'
                });
            })
            .catch(err => next(err));
    });
};

exports.postClearCart = (req, res, next) => {
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
        CartItem.deleteMany({ userId })
            .then(() => {
                res.json({
                    message: 'cart cleared'
                });
            })
            .catch(err => next(err));
    });
};

exports.postSyncCart = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
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
        const cart = req.body.cart;
        cart.forEach(async item => {
            const medicineId = item.medicineId;
            if (!medicineId) {
                const err = new Error('medicine id required');
                err.status = 422;
                return next(err);
            }
            if (!/^[a-z0-9 ]+$/i.test(medicineId)) {
                const err = new Error('invalid medicine id');
                err.status = 422;
                return next(err);
            }
            const quantity = item.quantity;
            if (!quantity) {
                const err = new Error('medicine quantity required');
                err.status = 422;
                return next(err);
            }
            if (parseInt(quantity) === NaN || quantity < 1) {
                const err = new Error('invalid medicine quantity');
                err.status = 422;
                return next(err);
            }
            await CartItem.findOneAndUpdate({ medicineId, userId }, { quantity }).exec().catch(err => next(err));
        });
        res.json({
            message: 'sync completed'
        });
    });
};

exports.getPrice = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
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
        const medName = req.params.medName;
        const char = medName[0].toLowerCase();
        const Medicine = require(`../models/medicine_${char}`);
        const med = await Medicine.findOne({ name: medName }).exec().catch(err => next(err));
        if (!med) {
            const err = new Error('invalid medicine name');
            err.status = 401;
            return next(err);
        }
        res.json({
            med,
            char
        });
    });
};