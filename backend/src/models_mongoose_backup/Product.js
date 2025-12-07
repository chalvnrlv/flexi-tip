const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  jastipService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JastipService',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add product name'],
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  variants: [{
    name: String,
    price: Number,
    stock: Number,
  }],
  images: [{
    url: String,
    public_id: String,
  }],
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  weight: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'soldout', 'preorder'],
    default: 'available',
  },
  specifications: {
    type: Map,
    of: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
