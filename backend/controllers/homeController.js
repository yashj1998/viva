const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const HeroSlide = require('../models/HeroSlide');
const PromoBanner = require('../models/PromoBanner');
const Review = require('../models/Review');
const TopPickSetting = require('../models/TopPickSetting');
const mockData = require('../seeds/mock-data');

exports.getHomePage = async (req, res) => {
  try {
    let categories = [];
    let products = [];
    let heroSlides = [];
    let promoBanners = [];
    let reviews = [];
    let topPicksSettings = null;

    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      try {
        [categories, products, heroSlides, promoBanners, reviews, topPicksSettings] = await Promise.all([
          Category.find().sort({ sortOrder: 1 }),
          Product.find({ isTopPick: true }).sort({ sortOrder: 1, createdAt: -1 }),
          HeroSlide.find({ isActive: true }).sort({ sortOrder: 1 }),
          PromoBanner.find().sort({ sortOrder: 1 }),
          Review.find().sort({ sortOrder: 1 }),
          TopPickSetting.findOne()
        ]);
      } catch (dbErr) {
        console.warn('Database query failed, using mock data:', dbErr.message);
      }
    }

    if (!categories || categories.length === 0) categories = mockData.categories;
    if (!products || products.length === 0) {
      products = mockData.products.filter(p => p.isTopPick === true).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    if (!heroSlides || heroSlides.length === 0) heroSlides = mockData.heroSlides;
    if (!promoBanners || promoBanners.length === 0) promoBanners = mockData.promoBanners;
    if (!reviews || reviews.length === 0) reviews = mockData.reviews;
    if (!topPicksSettings) topPicksSettings = mockData.topPicksSettings;

    // Limit display count if configured
    if (topPicksSettings && topPicksSettings.maxDisplayCount && products.length > topPicksSettings.maxDisplayCount) {
      products = products.slice(0, topPicksSettings.maxDisplayCount);
    }

    res.render('index', {
      title: 'ViVA — Live Better | Modern Shopping For Everyday Living',
      activePage: 'home',
      categories,
      products,
      topPicksSettings,
      heroSlides,
      promoBanners,
      reviews,
      cartCount: req.session.cartCount || 2,
      wishlistCount: req.session.wishlistCount || 3
    });
  } catch (err) {
    console.error('Home controller error:', err);
    res.status(500).send('Internal Server Error');
  }
};
