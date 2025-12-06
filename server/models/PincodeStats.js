const mongoose = require('mongoose');

const PincodeStatsSchema = new mongoose.Schema({
    pincode: { type: String, required: true, unique: true },
    active: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 }
});

module.exports = mongoose.model('PincodeStats', PincodeStatsSchema);
