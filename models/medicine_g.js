const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    _1mg: {type: Number, required: true},
    apollo: {type: Number, required: true},
    netmeds: {type: Number, required: true}
});

module.exports = mongoose.model('Medicine_g', medicineSchema);