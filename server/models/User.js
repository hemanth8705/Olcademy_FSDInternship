const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleOAuthId;
        }
    },
    googleOAuthId: {
        type: String,
        unique: true,
        sparse: true,
    },
    profileURL: {  // New field for storing profile URL/picture
        type: String,
    },
    // Field to help with password reset (if needed)
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);