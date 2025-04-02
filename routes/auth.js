const express = require('express');
const router = express.Router();

const {signup, signin, forgotPassword, resetPassword} = require('../controllers/auth')

// POST /signup -> create a new user

router.post('/signup', signup);

// POST /signin -> authenticate user

router.post('/signin', signin);

// POST /forgot-password -> send a password reset link to the user's email  

router.post('/forgot-password', forgotPassword);

// POST /reset-password -> reset the user's password

router.post('/reset-password/:token', resetPassword);  // The token is sent in the URL

module.exports = router;

// /auth/signup