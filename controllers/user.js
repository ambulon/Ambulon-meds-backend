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
        const medicine = req.body.medicine;
        if (!medicine.name) {
            const err = new Error('medicine name required');
            err.status = 422;
            return next(err);
        }
        const name = medicine.name;
        if (!/^[a-z0-9 ]+$/i.test(name)) {
            const err = new Error('invalid medicine name');
            err.status = 422;
            return next(err);
        }
        if (!medicine.desc) {
            const err = new Error('medicine description required');
            err.status = 422;
            return next(err);
        }
        const desc = medicine.desc;
        if (!/^[a-z0-9., ]+$/i.test(desc)) {
            const err = new Error('invalid medicine desc');
            err.status = 422;
            return next(err);
        }
        if (!medicine.quantity) {
            const err = new Error('medicine quantity required');
            err.status = 422;
            return next(err);
        }
        const quantity = medicine.quantity;
        if (parseInt(quantity) === NaN || quantity <= 0) {
            const err = new Error('invalid medicine quantity');
            err.status = 422;
            return next(err);
        }
        if (!medicine.price) {
            const err = new Error('medicine price required');
            err.status = 422;
            return next(err);
        }
        const price = medicine.price;
        if (parseFloat(price) === NaN || price <= 0) {
            const err = new Error('invalid medicine price');
            err.status = 422;
            return next(err);
        }
        if (!medicine.photo) {
            const err = new Error('medicine photo required');
            err.status = 422;
            return next(err);
        }
        const photo = medicine.photo;
        if (!/^[a-z0-9 -]+$/i.test(photo)) {
            const err = new Error('invalid medicine photo');
            err.status = 422;
            return next(err);
        }
        if (!medicine.vendor) {
            const err = new Error('medicine vendor required');
            err.status = 422;
            return next(err);
        }
        const vendor = medicine.vendor;
        if (!/^[a-z0-9 ]+$/i.test(vendor)) {
            const err = new Error('invalid medicine vendor');
            err.status = 422;
            return next(err);
        }
        if (!medicine.url) {
            const err = new Error('medicine url required');
            err.status = 422;
            return next(err);
        }
        const url = medicine.url;
        if (!/^[a-z0-9:/?. ]+$/i.test(url)) {
            const err = new Error('invalid medicine url');
            err.status = 422;
            return next(err);
        }
        let wishlist = user.wishlist;
        const new_medicine = new Medicine({
            name,
            desc,
            quantity,
            price,
            photo,
            vendor,
            url
        });
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
        const items = []
        const totalPrice = {
            netmeds: 0,
            _1mg: 0,
            apollo: 0
        };
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
    });
};

exports.postAddtoCart = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
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
        const name = req.body.name;
        const check = await CartItem.findOne({ name, userId }).exec().catch(err => next(err));
        if (check) {
            const err = new Error('item already in cart');
            err.status = 412;
            return next(err);
        }
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

exports.postRemovefromCart = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const err = new Error('token not provided');
        err.status = 401;
        return next(err);
    }
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
            const name = item.name;
            if(!name){
                const err = new Error('medicine name required');
                err.status = 422;
                return next(err);
            }
            if(!/^[a-z0-9 ]+$/i.test(name)){
                const err = new Error('invalid medicine name');
                err.status = 422;
                return next(err);
            }
            const quantity = item.quantity;
            if(!quantity){
                const err = new Error('medicine quantity required');
                err.status = 422;
                return next(err);
            }
            if(parseInt(quantity) === NaN || quantity < 1){
                const err = new Error('invalid medicine quantity');
                err.status = 422;
                return next(err);
            }
            const cart_item = await CartItem.findOne({ name, userId }).exec().catch(err => next(err));
            cart_item.quantity = quantity;
            await cart_item.save().catch(err => next(err));
        });
        res.json({
            message: 'sync completed'
        });
    });
};