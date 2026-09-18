const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/shop', shopController.getShopPage);
router.get('/categories', shopController.getCategoriesPage);
router.get('/product/:slug', shopController.getProductDetail);
router.get('/shop/:slug', shopController.getProductDetail);

module.exports = router;
