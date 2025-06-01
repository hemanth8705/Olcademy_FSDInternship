const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Try to find existing user
      let user = await User.findOne({ googleOAuthId: profile.id });
      
      if (!user) {
        console.log('User not found, creating new user with profile', profile);
        // Create new user if not found; store profile picture URL if available
        user = await User.create({
          email: profile.emails[0].value,
          googleOAuthId: profile.id,
          profileURL: profile.photos && profile.photos[0] ? profile.photos[0].value : null
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Optional: Passport session setup
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;