const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },    
  });
  
  module.exports = mongoose.model('courses', CourseSchema);