const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = 5000;

// Connect to MongoDBku
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Enable CORS
app.use(cors());
app.use(express.json()); // Enable JSON parsing


// Set up express-session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and configure session handling
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start OAuth flow
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google authentication
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    if (req.user) {
      // Generate a JWT token (without using hasPassword flag)
      const token = jwt.sign(
        { userId: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.redirect(`http://localhost:5173/?token=${token}`);
    }
    res.redirect('http://localhost:5173/');
  }
);

// Mount authentication routes for Email/Password
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Mount profile routes for updating password
const profileRoutes = require('./routes/profile');
app.use('/profile', profileRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});