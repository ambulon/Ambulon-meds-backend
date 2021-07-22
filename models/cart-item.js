const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicineId: {type: String, required: true},
    char: {type: String, required: true},
    quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Cart-Item', cartItemSchema);