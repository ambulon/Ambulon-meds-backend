const mongoose = require('mongoose');

const topPicksSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    _1mg: { type: String, required: true },
    apollo: { type: String, required: true },
    netmeds: { type: String, required: true },
    quantity: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('TopPicks', topPicksSchema);