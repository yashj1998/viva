const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'ViVA'
  },
  logoUrl: {
    type: String,
    default: '/images/viva-logo.png'
  },
  bannerUrl: {
    type: String,
    default: '/images/hero-composite.png'
  },
  storeDescription: {
    type: String,
    default: 'Modern shopping for everyday living with verified quality and deal-forward prices.'
  },
  businessName: {
    type: String,
    default: 'ViVA Modern Living Retail LLC'
  },
  taxId: {
    type: String,
    default: 'TAX-US-892401'
  },
  returnPolicy: {
    type: String,
    default: '30-day hassle-free returns with full refund guarantee.'
  },
  shippingPolicy: {
    type: String,
    default: 'Fast nationwide shipping with real-time tracking.'
  },
  tagline: {
    type: String,
    default: 'Live Better — Modern Shopping For Everyday Living'
  },
  announcementText: {
    type: String,
    default: 'FLASH SALE: Extra 25% Off All Living Essentials Today Only!'
  },
  announcementUrl: {
    type: String,
    default: '/shop'
  },
  freeShippingThreshold: {
    type: Number,
    default: 49.00
  },
  currencySymbol: {
    type: String,
    default: '$'
  },
  taxRate: {
    type: Number,
    default: 8.5
  },
  supportEmail: {
    type: String,
    default: 'support@viva.com'
  },
  supportPhone: {
    type: String,
    default: '+1 (800) 848-2548'
  },
  address: {
    type: String,
    default: '742 Evergreen Terrace, Springfield, OR 97477'
  },
  metaTitle: {
    type: String,
    default: 'ViVA — Live Better | Modern Multi-Category Storefront'
  },
  metaDescription: {
    type: String,
    default: 'Discover quality curated essentials across electronics, fashion, home, beauty, sports, and more with everyday price guarantees.'
  },
  metaKeywords: {
    type: String,
    default: 'ecommerce, shopping, viva, electronics, home decor, beauty, modern living'
  },
  ogImageUrl: {
    type: String,
    default: '/images/hero-composite.png'
  },
  googleAnalyticsId: {
    type: String,
    default: 'G-VIVA2026STORE'
  },
  socialFacebook: {
    type: String,
    default: 'https://facebook.com/viva.living'
  },
  socialInstagram: {
    type: String,
    default: 'https://instagram.com/viva.living'
  },
  socialTwitter: {
    type: String,
    default: 'https://x.com/viva_living'
  }
}, { timestamps: true });

module.exports = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema);
