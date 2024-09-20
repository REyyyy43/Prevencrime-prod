const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    phone: String,
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'cliente'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;