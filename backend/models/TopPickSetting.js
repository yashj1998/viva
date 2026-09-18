const mongoose = require('mongoose');

const topPickSettingSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Top Picks For You',
    trim: true
  },
  badge: {
    type: String,
    default: '✨',
    trim: true
  },
  subtitle: {
    type: String,
    default: 'Handpicked deals and trending items tailored for modern living',
    trim: true
  },
  seeAllText: {
    type: String,
    default: 'See All Deals',
    trim: true
  },
  seeAllUrl: {
    type: String,
    default: '/shop',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxDisplayCount: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

module.exports = mongoose.models.TopPickSetting || mongoose.model('TopPickSetting', topPickSettingSchema);
