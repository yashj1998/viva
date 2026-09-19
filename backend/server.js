const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Modules
const homeRoutes = require('./routes/index');
const shopRoutes = require('./routes/shopRoutes');
const pageRoutes = require('./routes/pageRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session handling for Cart & Wishlist counters and state
app.use(session({
  secret: process.env.SESSION_SECRET || 'viva_modern_living_secret_key_2026',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Global locals for views (Cart, Wishlist, and Live Site Settings)
const mongoose = require('mongoose');
const SiteSetting = require('./models/SiteSetting');
const mockData = require('./seeds/mock-data');

let cachedSiteSettings = null;
app.use(async (req, res, next) => {
  res.locals.cartCount = req.session.cartCount || 2;
  res.locals.wishlistCount = req.session.wishlistCount || 3;
  res.locals.customer = req.session.customer || null;
  res.locals.adminUser = req.session.adminUser || null;

  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await SiteSetting.findOne();
      if (!settings) {
        settings = await SiteSetting.create(mockData.siteSettings);
      }
      res.locals.siteSettings = settings;
    } else {
      res.locals.siteSettings = mockData.siteSettings;
    }
  } catch (err) {
    res.locals.siteSettings = mockData.siteSettings;
  }
  next();
});

// Static files (CSS, JS, Images from frontend/public)
app.use(express.static(path.join(__dirname, '../frontend/public'), { index: false }));

// View Engine (EJS from frontend/views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Mount Routes
app.use('/', homeRoutes);
app.use('/', shopRoutes);
app.use('/', pageRoutes);
app.use('/', cartRoutes);
app.use('/', authRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/seller', sellerRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 - Page Not Found | ViVA',
    activePage: ''
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 ViVA E-Commerce Storefront running at: http://localhost:${PORT}`);
  });
}

module.exports = app;
