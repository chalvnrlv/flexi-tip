const { Op } = require('sequelize');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, birthdate, isJastiper } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    // Password hashing is handled by Sequelize hooks in User model
    const user = await User.create({
      name,
      email,
      password,
      phone,
      birthdate,
      isJastiper: isJastiper || false,
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    // scope: 'withPassword' isn't standard in Sequelize unless defined, 
    // but we can query directly. The User model might abstract password hiding in toJSON
    // but here we need it for comparison. 
    // Standard User.findOne usually returns all fields unless attributes are specified.
    // However, if the model has logical exclusion, we might need to be careful.
    // Let's assume standard findOne returns everything for now or check model hooks.
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isJastiper: user.isJastiper,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user.id should be set by auth middleware
    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      birthdate: req.body.birthdate,
      avatar: req.body.avatar,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key =>
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const [updated] = await User.update(fieldsToUpdate, {
      where: { id: req.user.id }
    });

    if (updated) {
      const updatedUser = await User.findByPk(req.user.id);
      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'User not found or no changes made',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect',
      });
    }

    // Sequelize hook 'beforeUpdate' will hash the password if it's changed
    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      data: { token },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Google OAuth login
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
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({
      where: {
        [Op.or]: [{ googleId }, { email }]
      }
    });

    if (user) {
      // Update googleId if user exists but doesn't have it
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      // Note: Model requires password? It allows null?
      // Looking at User.js: password { allowNull: false }. 
      // We need to provide a dummy password or handle this case in model.
      // Usually social auth users get a random password.
      user = await User.create({
        googleId,
        email,
        name,
        avatar: picture, // Mapped profilePicture to avatar
        isVerified: true,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isJastiper: user.isJastiper,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Google authentication failed',
    });
  }
};
