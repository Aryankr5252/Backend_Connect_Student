// src/controllers/authController.js

const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtHelper');
const { HTTP_STATUS } = require('../utils/constants');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local',
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          authProvider: user.authProvider,
          token,
        },
      });
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is a Google user
    if (user.authProvider === 'google') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please login with Google',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// @desc    Google authentication
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    console.log('Google auth request received');
    const { idToken } = req.body;
    console.log('ID Token received:', idToken ? 'Yes' : 'No');

    if (!idToken) {
      console.log('No ID token provided');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide Google ID token',
      });
    }

    console.log('Verifying Google token...');
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;
    console.log('Token verified for:', email);

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      console.log('User exists:', email);
      // User exists, check if it's a Google user
      if (user.authProvider !== 'google') {
        console.log('User registered with password, not Google');
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Email already registered with password. Please login with password.',
        });
      }
    } else {
      console.log('Creating new Google user:', email);
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
      });
      console.log('New user created successfully');
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('JWT token generated for user:', user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Google authentication successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    console.error('Error details:', error.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error with Google authentication',
      error: error.message,
    });
  }
};

// @desc    Verify token and get user data
// @route   GET /api/auth/verify
// @access  Protected
const verifyToken = async (req, res) => {
  try {
    const user = req.user;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Token is valid',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error verifying token',
      error: error.message,
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  try {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};

// Keep old register function for backwards compatibility
const register = signup;

module.exports = {
  signup,
  register,
  login,
  googleAuth,
  verifyToken,
  logout,
};
