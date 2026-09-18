const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { requireSeller } = require('../middleware/sellerAuthMiddleware');

// Public portal access
router.get('/', (req, res) => res.redirect('/seller/dashboard'));
router.get('/login', sellerController.getLogin);
router.post('/login', sellerController.postLogin);
router.get('/register', sellerController.getRegister);
router.post('/register', sellerController.postRegister);
router.get('/logout', sellerController.getLogout);

// Authenticated seller dashboard & operations
router.get('/dashboard', requireSeller, sellerController.getDashboard);

// Products
router.get('/products', requireSeller, sellerController.getProducts);
router.post('/products/new', requireSeller, sellerController.postCreateProduct);
router.post('/products/status/:id', requireSeller, sellerController.postToggleProductStatus);
router.post('/products/delete/:id', requireSeller, sellerController.postDeleteProduct);

// Orders
router.get('/orders', requireSeller, sellerController.getOrders);
router.post('/orders/status', requireSeller, sellerController.postUpdateOrderStatus);

// Inventory
router.get('/inventory', requireSeller, sellerController.getInventory);
router.post('/inventory/adjust', requireSeller, sellerController.postAdjustStock);

// Analytics
router.get('/analytics', requireSeller, sellerController.getAnalytics);

// Store Profile & Settings
router.get('/profile', requireSeller, sellerController.getProfile);
router.post('/profile', requireSeller, sellerController.postProfile);

module.exports = router;
