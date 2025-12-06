const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    constituency: {
        area: String,
        mla: String,
        mp: String,
        pincode: String
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    },
    userId: String,
    userEmail: String,
    attachment: String, // Base64 or URL
    fileName: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Grievance', GrievanceSchema);
