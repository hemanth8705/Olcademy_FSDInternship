const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = userData;
        next();
    });
}

router.post('/update-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New passwords do not match' });
    }
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // If the user already has a password, verify the old password.
        if (user.password) {
            const match = await bcrypt.compare(oldPassword, user.password);
            if (!match) {
                return res.status(401).json({ error: 'Old password is incorrect' });
            }
        }
        // Hash and update the new password.
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        console.log('Updated user after /update-password :', user);
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    // console.log('User from DB:', user);
    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log('Sending user data from /profile/me:', {
      email: user.email,
      hasPassword: !!user.password,
      profileURL: user.profileURL  // include profileURL in the response
    });
    res.json({ 
      email: user.email, 
      hasPassword: !!user.password,
      profileURL: user.profileURL  // send profileURL from DB
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;