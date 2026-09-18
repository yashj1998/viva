const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  body: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
