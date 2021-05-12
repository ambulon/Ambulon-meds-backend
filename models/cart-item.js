const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceList: { type: Object, required: true }
});

module.exports = mongoose.model('Cart-Item', cartItemSchema);