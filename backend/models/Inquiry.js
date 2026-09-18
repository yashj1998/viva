const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    default: 'Customer Inquiry'
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved'],
    default: 'New'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
