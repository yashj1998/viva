function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    // Set default role to admin if not specified
    if (!req.session.adminRole) req.session.adminRole = 'admin';
    if (!req.session.adminName) req.session.adminName = 'Yash Joshi';

    // Global locals for admin views
    res.locals.currentUser = {
      id: req.session.adminId || null,
      name: req.session.adminName || 'Admin User',
      email: req.session.adminUser || 'admin@viva.com',
      role: req.session.adminRole || 'admin',
      avatarUrl: req.session.adminAvatar || '/images/avatars/sarah.jpg',
      storeName: req.session.adminStoreName || 'ViVA Store'
    };

    return next();
  }
  res.redirect('/admin/login');
}

function requireRole(allowedRoles = []) {
  return function(req, res, next) {
    if (!req.session || !req.session.isAdmin) {
      return res.redirect('/admin/login');
    }

    if (!req.session.adminRole) req.session.adminRole = 'admin';
    if (!req.session.adminName) req.session.adminName = 'Staff User';

    // Global locals for admin and seller views
    res.locals.currentUser = {
      id: req.session.adminId || null,
      name: req.session.adminName || 'Admin User',
      email: req.session.adminUser || 'admin@viva.com',
      role: req.session.adminRole || 'admin',
      avatarUrl: req.session.adminAvatar || '/images/avatars/sarah.jpg',
      storeName: req.session.adminStoreName || 'ViVA Store'
    };

    const currentRole = req.session.adminRole || 'admin';

    // Super Admin has universal access
    if (currentRole === 'admin') {
      return next();
    }

    if (allowedRoles.includes(currentRole)) {
      return next();
    }

    // Unauthorized access
    res.status(403).render('pages/404', {
      title: '403 — Unauthorized Access | ViVA Admin',
      activePage: ''
    });
  };
}

module.exports = {
  requireAdmin,
  requireRole
};

