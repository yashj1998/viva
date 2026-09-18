const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

const { requireCustomer } = require('../middleware/customerAuthMiddleware');

router.get('/deals', pageController.getDealsPage);
router.get('/new-arrivals', pageController.getNewArrivalsPage);
router.get('/brands', pageController.getBrandsPage);
router.get('/inspiration', pageController.getInspirationPage);
router.get('/track-order', requireCustomer, pageController.getTrackOrderPage);
router.post('/track-order', requireCustomer, pageController.postTrackOrder);

module.exports = router;
