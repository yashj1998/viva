const mongoose = require('mongoose');

const promoBannerSchema = new mongoose.Schema({
  badgeLabel: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  ctaLabel: {
    type: String,
    default: 'Shop Now →'
  },
  ctaUrl: {
    type: String,
    default: '#shop'
  },
  imageUrl: {
    type: String,
    required: true
  },
  themeBg: {
    type: String,
    default: '#eef1e6'
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.models.PromoBanner || mongoose.model('PromoBanner', promoBannerSchema);
