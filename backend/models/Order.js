const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'United States' }
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      sku: { type: String, default: '' },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      image: { type: String, default: '' },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
    }
  ],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Ordered', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Ordered',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Paid',
    index: true
  },
  shippingStatus: {
    type: String,
    enum: ['Unfulfilled', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Returned'],
    default: 'Unfulfilled',
    index: true
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  carrier: {
    type: String,
    default: 'Standard Shipping'
  },
  statusHistory: [
    {
      status: { type: String },
      paymentStatus: { type: String },
      shippingStatus: { type: String },
      date: { type: Date, default: Date.now },
      note: { type: String, default: '' },
      updatedBy: { type: String, default: 'System' }
    }
  ],
  estimatedDelivery: { type: String, default: '3 - 5 business days' },
  paymentMethod: { type: String, default: 'Credit Card' }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
