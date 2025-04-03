const User = require('../models/User');
const courses = require('../models/Course')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // If you want to implement JWT authentication
const nodemailer = require('nodemailer');
const Course = require('../models/Course');
// Signup
const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Input Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ fullname, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Signin
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ error: 'Incorrect email' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Generate a JWT (if you're using JWT for authentication)
    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user details
    res.status(200).json({
      message: 'Signin successful',
      token: token, // Send the token for future requests
      user: {
        fullName: existingUser.fullname,
        email: existingUser.email,
      }
    });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// forgot password

const forgotPassword = async (req, res) => {
  const {email} = req.body

  try{
    // check if email exist 
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({error: 'Email not found'});
    }
  
    // generate a token
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '10m'});
  
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
    await user.save();
  
    // send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      }
    });
  
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      from: 'Fitzone <noreply@fitzone.com>',
      to: user.email,
      subject: 'Reset Password',
      text: `You are receiving this email because you (or someone else) requested a password reset for your Fitzone account.\n\n
        Please click on the following link to reset your password:\n\n
        ${resetUrl}\n\n
        If you did not request a password reset, please ignore this email and your password will remain unchanged.\n`
    })
    res.status(200).json({message: 'Reset password email sent'});
  
    } catch(error){
    console.error('Error sending forgot password email:', error);
    res.status(500).json({error: 'Error sending mail'});
  
  }

}

// reset password
const resetPassword = async (req, res) => {
  const { token } = req.params; // Get token from URL parameter
  const { newPassword } = req.body;

  try {
    // Verify token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token is invalid or expired' });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const Courses = async (req, res) =>{

try {
  const courses = await Course.find();
  if (!courses || courses.length === 0) {
    return res.status(404).json({ message: 'No courses found' });
  }
  res.status(200).json(courses);
  
} catch (error) {
  console.error('Error fetching courses:', error);
  res.status(500).json({ error: 'Internal Server Error' });
  
}

}


module.exports = { signup, signin, forgotPassword, resetPassword, Courses };
