function requireCustomer(req, res, next) {
  if (req.session && req.session.customer) {
    res.locals.customer = req.session.customer;
    return next();
  }

  const redirectUrl = req.originalUrl || '/account';
  let msg = 'Please sign in to your account to continue.';
  if (redirectUrl.includes('wishlist')) {
    msg = 'Please sign in to access and save items to your wishlist.';
  } else if (redirectUrl.includes('cart')) {
    msg = 'Please sign in to access your shopping cart and checkout.';
  } else if (redirectUrl.includes('track-order')) {
    msg = 'Please sign in to track your orders in real-time.';
  }

  res.redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}&msg=${encodeURIComponent(msg)}`);
}

function requireCustomerApi(req, res, next) {
  if (req.session && req.session.customer) {
    res.locals.customer = req.session.customer;
    return next();
  }

  let redirectUrl = '/account';
  if (req.headers.referer) {
    try {
      redirectUrl = new URL(req.headers.referer).pathname;
    } catch (e) {
      redirectUrl = req.headers.referer;
    }
  }

  return res.status(401).json({
    success: false,
    requireLogin: true,
    redirect: `/login?redirect=${encodeURIComponent(redirectUrl)}&msg=${encodeURIComponent('Please sign in to add items or manage your list.')}`,
    message: 'Authentication required. Please sign in to your account.'
  });
}

module.exports = {
  requireCustomer,
  requireCustomerApi
};
