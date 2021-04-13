const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    f_id: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    search_history: [String],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
});

module.exports = mongoose.model('User', userSchema);