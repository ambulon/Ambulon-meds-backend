const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    site: { type: String, required: true },
    desc: { type: String, required: true },
    code: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Coupon', couponSchema);