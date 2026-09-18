const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  category: {
    type: String,
    default: 'General'
  },
  price: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    required: true
  },
  discountPercent: {
    type: Number,
    default: function() {
      if (this.price && this.salePrice && this.price > this.salePrice) {
        return Math.round(((this.price - this.salePrice) / this.price) * 100);
      }
      return 0;
    }
  },
  ratingAvg: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 100
  },
  primaryImageUrl: {
    type: String,
    required: true
  },
  isTopPick: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 50
  },
  badgeText: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    index: true
  },
  sellerName: {
    type: String,
    default: 'ViVA Official Store'
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  variants: [
    {
      sku: { type: String, uppercase: true, trim: true },
      name: { type: String, required: true },
      color: { type: String, default: '' },
      size: { type: String, default: '' },
      price: { type: Number, required: true },
      stock: { type: Number, default: 0 }
    }
  ],
  sortOrder: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: 'Crafted with premium materials for maximum durability and everyday performance. Includes full manufacturer warranty, easy returns, and customer satisfaction assurance.'
  },
  brand: {
    type: String,
    default: 'ViVA Essentials'
  },
  features: {
    type: [String],
    default: [
      'High quality craftsmanship designed for longevity',
      'Ergonomic, modern minimalist aesthetic',
      'Eco-friendly sustainable materials',
      'Includes 2-year official manufacturer warranty'
    ]
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      'Brand': 'ViVA Essentials',
      'Warranty': '2 Years Limited',
      'Return Window': '30 Days Free Returns',
      'Material': 'Premium Grade Materials',
      'Packaging': '100% Recyclable Packaging'
    }
  },
  galleryImages: {
    type: [String],
    default: []
  },
  colors: {
    type: [String],
    default: ['Classic Black', 'Natural Beige', 'Forest Green']
  },
  sizes: {
    type: [String],
    default: ['Standard', 'Pro']
  }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
