const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Fallback URI if .env fails
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mridul:mriduljoythattil@cluster0.okybbft.mongodb.net/jansamvaad";

console.log("---------------------------------------------------");
console.log("Server starting...");
console.log("Resolved .env path:", path.resolve(__dirname, '../.env'));
console.log("Using MongoDB URI:", MONGO_URI);
console.log("---------------------------------------------------");

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Routes
const Grievance = require('./models/Grievance');
const PincodeStats = require('./models/PincodeStats');

// GET all grievances
app.get('/api/grievances', async (req, res) => {
    try {
        const { pincode } = req.query;
        let query = {};
        if (pincode) {
            query['constituency.pincode'] = pincode;
        }
        const grievances = await Grievance.find(query).sort({ createdAt: -1 });
        res.json(grievances);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET stats for a pincode
app.get('/api/stats/:pincode', async (req, res) => {
    try {
        const { pincode } = req.params;
        const stats = await PincodeStats.findOne({ pincode });
        res.json(stats || { active: 0, resolved: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new grievance & Increment Stats
app.post('/api/grievances', async (req, res) => {
    try {
        console.log("Received Grievance Payload:", JSON.stringify(req.body, null, 2));

        // 1. Save Grievance
        const newGrievance = new Grievance(req.body);
        const savedGrievance = await newGrievance.save();
        console.log("Saved Grievance to DB:", savedGrievance);

        // 2. Increment Pincode Stats
        const pincode = req.body.constituency?.pincode;
        if (pincode) {
            await PincodeStats.findOneAndUpdate(
                { pincode },
                { $inc: { active: 1 } },
                { upsert: true, new: true }
            );
            console.log(`Incremented stats for ${pincode}`);
        }

        res.status(201).json(savedGrievance);
    } catch (err) {
        console.error("Error saving grievance:", err);
        res.status(400).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Jansamvaad Backend is Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
