const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructor: String,
    duration: String,
  });
  
  module.exports = mongoose.model('courses', CourseSchema);