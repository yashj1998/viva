const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    default: ''
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    index: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  changeAmount: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    default: 'Manual Adjustment',
    trim: true
  },
  note: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: String,
    default: 'Staff'
  }
}, { timestamps: true });

module.exports = mongoose.models.InventoryLog || mongoose.model('InventoryLog', inventoryLogSchema);
