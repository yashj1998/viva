const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'seller', 'support'],
    default: 'seller'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  avatarUrl: {
    type: String,
    default: '/images/avatars/sarah.jpg'
  },
  // Seller store profile details
  storeName: {
    type: String,
    default: 'ViVA Store'
  },
  storeSlug: {
    type: String,
    default: 'viva-store'
  },
  storeDescription: {
    type: String,
    default: 'Modern living essentials and curated products with everyday guarantees.'
  },
  logoUrl: {
    type: String,
    default: '/images/viva-logo.png'
  },
  bannerUrl: {
    type: String,
    default: '/images/hero-composite.png'
  },
  businessEmail: {
    type: String,
    default: ''
  },
  businessPhone: {
    type: String,
    default: ''
  },
  businessAddress: {
    type: String,
    default: ''
  },
  businessInfo: {
    taxId: { type: String, default: '' },
    registrationNumber: { type: String, default: '' },
    returnPolicy: { type: String, default: '30-day hassle-free returns.' },
    shippingPolicy: { type: String, default: 'Free standard shipping on orders over $49.' }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
