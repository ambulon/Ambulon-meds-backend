const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    photo: {type: String, required: true},
    vendor: {type: String, required: true},
    url: {type: String, required: true},
});

module.exports = mongoose.model('Medicine', medicineSchema);