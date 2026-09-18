const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  iconClass: {
    type: String,
    default: 'fa-solid fa-layer-group'
  },
  iconSvg: {
    type: String,
    default: ''
  },
  bgColor: {
    type: String,
    default: '#e6edf5'
  },
  iconColor: {
    type: String,
    default: '#123524'
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
