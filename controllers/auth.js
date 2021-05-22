const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { tokenSecret } = require('../util/config');
const User = require('../models/user');
const Token = require('../models/token');

exports.postAddUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
        return next(err);
    }
    const f_id = req.body.f_id;
    const name = req.body.name;
    const age = req.body.age;
    const image = req.body.imageUrl;
    const email = req.body.email;
    let user = await User.findOne({ f_id }).exec().catch(err => next(err));
    if (user) {
        const err = new Error('duplicate firebase id');
        err.status = 400;
        return next(err);
    }
    user = await User.findOne({ email }).exec().catch(err => next(err));
    if (user) {
        const err = new Error('duplicate email');
        err.status = 400;
        return next(err);
    }
    const new_user = new User({
        f_id,
        name,
        image,
        age,
        image,
        email
    });
    user = await new_user.save().catch(err => next(err));
    const token = jwt.sign({
        userId: user._id,
        f_id: user.f_id,
    }, tokenSecret);
    const insert_token = new Token({
        token,
        userId: user._id
    });
    insert_token
        .save()
        .then(() => {
            res.status(200).json({
                token
            });
        })
        .catch(err => next(err));
};

exports.getToken = async (req, res, next) => {
    const f_id = req.params.f_id;
    const check = /^[a-z0-9]+$/i.test(f_id);
    if (!check) {
        const err = new Error('invalid firebase id');
        err.status = 422;
        return next(err);
    }
    const user = await User.findOne({ f_id }).exec().catch(err => next(err));
    if (!user) {
        const err = new Error('user not added');
        err.status = 422;
        return next(err);
    }
    const token = jwt.sign({
        userId: user._id,
        f_id: user.f_id,
    }, tokenSecret);
    const insert_token = new Token({
        token,
        userId: user._id
    });
    insert_token
        .save()
        .then(() => {
            res.status(200).json({
                token
            });
        })
        .catch(err => next(err));
};

exports.postLogout = (req, res, next) => {
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
        const user = await User.findById(decoded.id).exec().catch(err => next(err));
        if (!user) {
            const error = new Error('invalid token');
            error.status = 401;
            return next(error);
        }
        Token
            .findOneAndDelete({ token })
            .then(deleted_token => {
                if (!deleted_token) {
                    res.status(401).json({
                        message: 'invalid token'
                    });
                }
                res.status(200).json({
                    message: 'logged out'
                });
            })
            .catch();
    });
};

exports.postLogoutAllDevices = (req, res, next) => {
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
        const user = await User.findById(decoded.id).exec().catch(err => next(err));
        if (!user) {
            const error = new Error('invalid token');
            error.status = 401;
            return next(error);
        }
        Token
            .deleteMany({ userId: decoded.id })
            .then(result => {
                if (result.deletedCount === 0) {
                    res.status(401).json({
                        message: 'invalid token'
                    });
                    return;
                }
                res.status(200).json({
                    message: 'logged out'
                });
            })
            .catch(err => next(err));
    });
};