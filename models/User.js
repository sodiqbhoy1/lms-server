const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phoneNumber: { type: String, default: null },  // Add phone number field
    // address: { type: String, default: null },  // Add address field
    // dateOfBirth: { type: Date, default: null },  // Add date of birth field
    resetPasswordToken: String,       // Add this
    resetPasswordExpires: Date,  
})
  


module.exports = mongoose.model('users', userSchema);