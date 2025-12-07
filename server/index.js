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

// PATCH Resolve Grievance
app.patch('/api/grievances/:id/resolve', async (req, res) => {
    try {
        const { id } = req.params;
        const grievance = await Grievance.findById(id);

        if (!grievance) {
            return res.status(404).json({ error: "Grievance not found" });
        }

        if (grievance.status === 'Resolved') {
            return res.json(grievance); // Already resolved
        }

        // Update status
        grievance.status = 'Resolved';
        const updatedGrievance = await grievance.save();

        // Update Stats
        const pincode = grievance.constituency?.pincode;
        if (pincode) {
            await PincodeStats.findOneAndUpdate(
                { pincode },
                { $inc: { active: -1, resolved: 1 } },
                { upsert: true, new: true } // Should ideally exist, but upsert for safety
            );
            console.log(`Updated stats for ${pincode}: active-1, resolved+1`);
        }

        res.json(updatedGrievance);
    } catch (err) {
        console.error("Error resolving grievance:", err);
        res.status(500).json({ error: err.message });
    }
});

// Admin Auth Routes
const Admin = require('./models/Admin');

// POST Admin Register (For initial setup)
app.post('/api/admin/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Simple validation
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // Check if exists
        const existing = await Admin.findOne({ username });
        if (existing) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully" });
    } catch (err) {
        console.error("Admin register error:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Direct password comparison (for hackathon scope)
        if (admin.password !== password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Return logic success (in a real app, generate JWT)
        // Here we just return success and let client handle "session" via local storage flag
        res.json({ message: "Login successful", username: admin.username, role: admin.role });
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Serve Static Assets (Frontend)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for SPA (React Router)
// Catch-all route for SPA (React Router)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
