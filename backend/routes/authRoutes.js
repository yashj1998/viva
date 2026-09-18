const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireCustomer } = require('../middleware/customerAuthMiddleware');

// Public customer auth routes
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

// Protected customer account routes
router.get('/account', requireCustomer, authController.getAccountPage);
router.post('/account/profile', requireCustomer, authController.postUpdateProfile);
router.post('/account/password', requireCustomer, authController.postUpdatePassword);
router.post('/account/address', requireCustomer, authController.postAddAddress);

module.exports = router;
