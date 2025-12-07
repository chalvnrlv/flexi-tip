const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Sign In / Sign Up
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required',
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        password: Math.random().toString(36).slice(-8), // Random password (won't be used)
        isVerified: true, // Auto-verify Google users
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        role: user.role,
        isJastiper: user.isJastiper,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message,
    });
  }
};

// @desc    Verify Google token (optional - for frontend validation)
// @route   POST /api/auth/google/verify
// @access  Public
exports.verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    res.status(200).json({
      success: true,
      data: payload,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid Google token',
    });
  }
};
