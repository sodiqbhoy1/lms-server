const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title: String,
    code: String,
    instructor: String,
    duration: String,
    description: String,
    
  });
  
  module.exports = mongoose.model('courses', CourseSchema);