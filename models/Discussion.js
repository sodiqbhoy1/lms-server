const mongoose = require('mongoose');


const DiscussionSchema = new mongoose.Schema({
    courseId: String, // To associate discussions with courses
    user: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Discussion', DiscussionSchema);