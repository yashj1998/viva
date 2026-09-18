const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireCustomer, requireCustomerApi } = require('../middleware/customerAuthMiddleware');

// Cart & Wishlist Routes (Login Protected)
router.get('/cart', requireCustomer, cartController.getCartPage);
router.post('/cart/add', requireCustomerApi, cartController.addToCart);
router.post('/cart/update', requireCustomer, cartController.updateCartItem);

router.get('/wishlist', requireCustomer, cartController.getWishlistPage);
router.post('/wishlist/update', requireCustomer, cartController.updateWishlist);

router.get('/checkout', requireCustomer, cartController.getCheckoutPage);
router.post('/checkout', requireCustomer, cartController.processCheckout);

module.exports = router;
