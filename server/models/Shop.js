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
  images: {
    type: [{
      url: String,
      alt: String
    }],
    default: [{ 
      url: 'https://imgs.search.brave.com/td5Jq69pdZpao4JkR-D1Z522xQ8nB4OYYqnP18bq_QU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8wOC8yOC9z/aG9wLXN0b3JlLWZs/YXQtaWNvbi12ZWN0/b3ItMTQyNzA4Mjgu/anBn', 
      alt: 'Default shop image' 
    }]
  },
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