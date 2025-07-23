const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['restaurant', 'grocery', 'electronics', 'clothing', 'pharmacy', 'services', 'other']
  },
  description: {
    type: String,
    maxlength: 500
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    whatsapp: String,
    email: String
  },
  images: [{
    url: String,
    alt: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
shopSchema.index({ name: 'text', description: 'text' });
shopSchema.index({ category: 1 });
shopSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Shop', shopSchema);