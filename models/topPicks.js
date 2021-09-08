const mongoose = require('mongoose');

const topPicksSchema = new mongoose.Schema({
    medId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    char: { type: String, required: true }
});

module.exports = mongoose.model('TopPicks', topPicksSchema);