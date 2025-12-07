const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allow null values
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  birthdate: {
    type: Date,
  },
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150',
  },
  role: {
    type: String,
    enum: ['user', 'jastiper', 'admin'],
    default: 'user',
  },
  isJastiper: {
    type: Boolean,
    default: false,
  },
  jastipProfile: {
    bio: String,
    rating: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    idCard: String,
    bankAccount: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
  },
  addresses: [{
    label: String,
    recipientName: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
    isDefault: Boolean,
  }],
  savedJastipers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
}, {
  timestamps: true,
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
