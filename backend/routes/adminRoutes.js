const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin, requireRole } = require('../middleware/authMiddleware');

// ==========================================
// Public Auth Routes
// ==========================================
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// ==========================================
// Protected Routes - General Staff & Sellers
// ==========================================
router.get('/', requireAdmin, adminController.getDashboard);

// Orders & Shipping (Admin, Manager, Seller)
router.get('/orders', requireRole(['admin', 'manager', 'seller']), adminController.getOrders);
router.get('/orders/detail/:orderNumber', requireRole(['admin', 'manager', 'seller']), adminController.getOrderDetailJson);
router.post('/orders/status', requireRole(['admin', 'manager', 'seller']), adminController.postUpdateOrderStatus);
router.post('/orders/bulk', requireRole(['admin', 'manager', 'seller']), adminController.postBulkUpdateOrders);

// Products Catalog & Bulk Actions (Admin, Manager, Seller)
router.get('/products', requireRole(['admin', 'manager', 'seller']), adminController.getProducts);
router.get('/products/view/:id', requireRole(['admin', 'manager', 'seller']), adminController.getProductViewJson);
router.get('/products/edit/:id', requireRole(['admin', 'manager', 'seller']), adminController.getProductEdit);
router.post('/products/edit/:id', requireRole(['admin', 'manager', 'seller']), adminController.postUpdateProductDetail);
router.post('/products/new', requireRole(['admin', 'manager', 'seller']), adminController.postCreateProduct);
router.post('/products/status/:id', requireRole(['admin', 'manager', 'seller']), adminController.postToggleProductStatus);
router.post('/products/delete/:id', requireRole(['admin', 'manager', 'seller']), adminController.postDeleteProduct);
router.post('/products/bulk', requireRole(['admin', 'manager', 'seller']), adminController.postBulkActionProducts);

// Dedicated Dynamic Inventory Management (Admin, Manager, Seller)
router.get('/inventory', requireRole(['admin', 'manager', 'seller']), adminController.getInventory);
router.post('/inventory/adjust', requireRole(['admin', 'manager', 'seller']), adminController.postAdjustStock);
router.get('/inventory/history/:productId', requireRole(['admin', 'manager', 'seller']), adminController.getInventoryHistory);
router.post('/inventory/bulk-adjust', requireRole(['admin', 'manager', 'seller']), adminController.postBulkAdjustStock);

// Seller Store Profile Management
router.get('/profile', requireAdmin, adminController.getSellerProfile);
router.post('/profile', requireAdmin, adminController.postUpdateSellerProfile);

// Inquiries & Customer Messages
router.get('/inquiries', requireRole(['admin', 'manager', 'support']), adminController.getInquiries);
router.post('/inquiries/status/:id', requireRole(['admin', 'manager', 'support']), adminController.postUpdateInquiryStatus);
router.post('/inquiries/delete/:id', requireRole(['admin', 'manager', 'support']), adminController.postDeleteInquiry);

// Reviews & Testimonials
router.get('/reviews', requireRole(['admin', 'manager']), adminController.getReviews);
router.post('/reviews/new', requireRole(['admin', 'manager']), adminController.postCreateReview);
router.post('/reviews/toggle/:id', requireRole(['admin', 'manager']), adminController.postToggleReviewVerified);
router.post('/reviews/delete/:id', requireRole(['admin', 'manager']), adminController.postDeleteReview);

// Newsletter Subscribers
router.get('/subscribers', requireRole(['admin', 'manager']), adminController.getSubscribers);
router.post('/subscribers/delete/:id', requireRole(['admin', 'manager']), adminController.postDeleteSubscriber);

// Top Picks Deals
router.get('/top-picks', requireRole(['admin', 'manager']), adminController.getTopPicks);
router.post('/top-picks/toggle/:id', requireRole(['admin', 'manager']), adminController.postToggleTopPick);
router.post('/top-picks/update/:id', requireRole(['admin', 'manager']), adminController.postUpdateTopPick);
router.post('/top-picks/add-existing', requireRole(['admin', 'manager']), adminController.postAddExistingTopPick);
router.post('/top-picks/remove/:id', requireRole(['admin', 'manager']), adminController.postRemoveTopPick);
router.post('/top-picks/settings', requireRole(['admin', 'manager']), adminController.postUpdateTopPicksSettings);

// Categories
router.get('/categories', requireRole(['admin', 'manager']), adminController.getCategories);
router.post('/categories/new', requireRole(['admin', 'manager']), adminController.postCreateCategory);
router.post('/categories/status/:id', requireRole(['admin', 'manager']), adminController.postToggleCategoryStatus);
router.post('/categories/update/:id', requireRole(['admin', 'manager']), adminController.postUpdateCategory);
router.post('/categories/delete/:id', requireRole(['admin', 'manager']), adminController.postDeleteCategory);

// Storefront Content & Banners
router.get('/banners', requireRole(['admin', 'manager']), adminController.getBanners);
router.post('/banners/hero/new', requireRole(['admin', 'manager']), adminController.postCreateHeroSlide);
router.post('/banners/hero/update/:id', requireRole(['admin', 'manager']), adminController.postUpdateHeroSlide);
router.post('/banners/hero/delete/:id', requireRole(['admin', 'manager']), adminController.postDeleteHeroSlide);
router.post('/banners/promo/update/:id', requireRole(['admin', 'manager']), adminController.postUpdatePromoBanner);

// Media Library
router.get('/media', requireRole(['admin', 'manager']), adminController.getMedia);
router.post('/media/new', requireRole(['admin', 'manager']), adminController.postAddMedia);

// ==========================================
// Protected Routes - Super Admin Only
// ==========================================
// User Roles & Access Control (RBAC) & Customers (Multi-Table)
router.get('/users', requireRole(['admin']), adminController.getUsers);
router.post('/users/new', requireRole(['admin']), adminController.postCreateUser);
router.post('/users/role/:id', requireRole(['admin']), adminController.postUpdateUserRole);
router.post('/users/status/:id', requireRole(['admin']), adminController.postToggleUserStatus);
router.post('/users/delete/:id', requireRole(['admin']), adminController.postDeleteUser);

// Dedicated Sellers & Merchants DB (Admin)
router.get('/sellers', requireRole(['admin']), (req, res) => res.redirect('/admin/users?tab=sellers'));
router.post('/sellers/new', requireRole(['admin']), adminController.postCreateUser);
router.post('/sellers/status/:id', requireRole(['admin']), adminController.postToggleSellerStatus);
router.post('/sellers/delete/:id', requireRole(['admin']), adminController.postDeleteUser);

// Storefront Customers Management
router.post('/customers/new', requireRole(['admin']), adminController.postCreateCustomer);
router.post('/customers/edit/:id', requireRole(['admin']), adminController.postUpdateCustomer);
router.post('/customers/password/:id', requireRole(['admin']), adminController.postResetCustomerPassword);
router.post('/customers/status/:id', requireRole(['admin']), adminController.postToggleCustomerStatus);
router.post('/customers/delete/:id', requireRole(['admin']), adminController.postDeleteCustomer);
router.post('/customers/bulk', requireRole(['admin']), adminController.postBulkCustomerAction);
router.get('/customers/details/:id', requireRole(['admin']), adminController.getCustomerDetails);
router.get('/customers/export', requireRole(['admin']), adminController.exportCustomers);

// Website, SEO & Global Settings
router.get('/settings', requireRole(['admin']), adminController.getSettings);
router.post('/settings/update', requireRole(['admin']), adminController.postUpdateSettings);

// Audit Trail & Logs
router.get('/audit-logs', requireRole(['admin']), adminController.getAuditLogs);

module.exports = router;
