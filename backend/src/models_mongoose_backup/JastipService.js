const mongoose = require('mongoose');

const jastipServiceSchema = new mongoose.Schema({
  jastiper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['local', 'global'],
    required: true,
  },
  origin: {
    type: String,
    required: [true, 'Please add origin location'],
  },
  destination: {
    type: String,
    required: [true, 'Please add destination location'],
  },
  departureDate: {
    type: Date,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  availableCapacity: {
    type: Number,
    required: true,
    min: 0,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    url: String,
    public_id: String,
  }],
  status: {
    type: String,
    enum: ['active', 'full', 'completed', 'cancelled'],
    default: 'active',
  },
  terms: {
    type: String,
  },
  prohibitedItems: [{
    type: String,
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate average rating
jastipServiceSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
};

module.exports = mongoose.model('JastipService', jastipServiceSchema);
