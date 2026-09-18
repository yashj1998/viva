const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  headline: {
    type: String,
    default: 'Elevate Your Everyday'
  },
  subcopy: {
    type: String,
    default: 'Discover quality products across every category — made for the way you live.'
  },
  ctaLabel: {
    type: String,
    default: 'Shop Now →'
  },
  ctaUrl: {
    type: String,
    default: '#shop'
  },
  badgeText: {
    type: String,
    default: 'SUMMER SALE · UP TO 40% OFF'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  bgColor: {
    type: String,
    default: '#f3efe3'
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSlideSchema);
