const AdminUser = require('../models/AdminUser');

async function requireSeller(req, res, next) {
  if (!req.session || (!req.session.isSeller && !req.session.isAdmin && req.session.adminRole !== 'seller' && req.session.adminRole !== 'admin')) {
    return res.redirect('/seller/login');
  }

  try {
    const sellerId = req.session.adminId;
    let seller = null;
    if (sellerId) {
      seller = await AdminUser.findById(sellerId);
    }

    if (!seller && req.session.adminUser) {
      seller = await AdminUser.findOne({ email: req.session.adminUser });
    }

    if (!seller) {
      // Fallback seller document if session has values
      seller = {
        _id: req.session.adminId || '6aa5135edbba411b44f809ce',
        name: req.session.adminName || 'Seller Partner',
        email: req.session.adminUser || 'seller@viva.com',
        role: req.session.adminRole || 'seller',
        storeName: req.session.adminStoreName || 'Apex Audio & Living Studio',
        storeSlug: 'apex-audio-living-studio',
        logoUrl: '/images/viva-logo.png',
        bannerUrl: '/images/hero-composite.png',
        status: 'active'
      };
    }

    if (seller.status === 'suspended') {
      return res.status(403).render('pages/404', {
        title: 'Merchant Account Suspended | ViVA Seller Center',
        activePage: '',
        message: 'Your merchant account has been temporarily suspended. Please contact platform administration.'
      });
    }

    // Populate seller locals for views
    req.seller = seller;
    res.locals.currentSeller = {
      id: seller._id,
      name: seller.name,
      email: seller.email,
      role: seller.role,
      storeName: seller.storeName || 'ViVA Merchant Store',
      storeSlug: seller.storeSlug || 'viva-store',
      logoUrl: seller.logoUrl || '/images/viva-logo.png',
      bannerUrl: seller.bannerUrl || '/images/hero-composite.png',
      avatarUrl: seller.avatarUrl || '/images/avatars/sarah.jpg',
      status: seller.status || 'active',
      businessPhone: seller.businessPhone || '',
      businessEmail: seller.businessEmail || seller.email,
      businessAddress: seller.businessAddress || '',
      businessInfo: seller.businessInfo || {}
    };
    res.locals.currentUser = res.locals.currentSeller;

    next();
  } catch (err) {
    console.error('requireSeller middleware error:', err);
    return res.redirect('/seller/login');
  }
}

module.exports = {
  requireSeller
};
