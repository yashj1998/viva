const mongoose = require('mongoose');
const { hashPassword, verifyPassword } = require('../utils/passwordHelper');

const addressSchema = new mongoose.Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zip: { type: String, default: '' },
  country: { type: String, default: 'United States' },
  isDefault: { type: Boolean, default: true }
}, { _id: true });

const userSchema = new mongoose.Schema({
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
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: '/images/avatars/sarah.jpg'
  },
  addresses: [addressSchema],
  role: {
    type: String,
    enum: ['customer', 'vip', 'wholesale'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Schema instance methods
userSchema.methods.setPassword = function(password) {
  const { hash, salt } = hashPassword(password);
  this.passwordHash = hash;
  this.salt = salt;
};

userSchema.methods.verifyPassword = function(password) {
  return verifyPassword(password, this.passwordHash, this.salt);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
