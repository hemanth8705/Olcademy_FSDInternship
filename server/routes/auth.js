const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Route for registering a new user (email/password)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for logging in with email and password
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;