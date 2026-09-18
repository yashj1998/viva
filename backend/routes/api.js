const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// Newsletter subscription endpoint
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // If MongoDB is connected, save to database
    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
        if (!existing) {
          await NewsletterSubscriber.create({ email: cleanEmail, source: 'homepage-footer' });
        }
      } catch (dbErr) {
        console.warn('Could not persist subscriber to MongoDB:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for exclusive deals.'
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

const { requireCustomerApi } = require('../middleware/customerAuthMiddleware');

// Quick Add-to-Cart endpoint (Login Required)
router.post('/cart/add', requireCustomerApi, (req, res) => {
  if (typeof req.session.cartCount === 'undefined') {
    req.session.cartCount = 2;
  }
  req.session.cartCount += 1;

  res.json({
    success: true,
    cartCount: req.session.cartCount,
    message: 'Added to your cart!'
  });
});

// Toggle Wishlist endpoint (Login Required)
router.post('/wishlist/toggle', requireCustomerApi, (req, res) => {
  if (typeof req.session.wishlistCount === 'undefined') {
    req.session.wishlistCount = 3;
  }
  const { action } = req.body;
  if (action === 'remove' && req.session.wishlistCount > 0) {
    req.session.wishlistCount -= 1;
  } else {
    req.session.wishlistCount += 1;
  }

  res.json({
    success: true,
    wishlistCount: req.session.wishlistCount
  });
});

// Session status endpoint
router.get('/session', (req, res) => {
  res.json({
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
});

module.exports = router;
