const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const mockData = require('../seeds/mock-data');
const { hashPassword, verifyPassword } = require('../utils/passwordHelper');

// Helper to get demo orders for offline fallback
function getCustomerOrdersFallback(email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const demoOrders = [
    {
      _id: 'ord_1',
      orderNumber: 'VIVA-9824',
      customer: { name: 'Alex Morgan', email: 'alex@example.com', city: 'Springfield', address: '742 Evergreen Terrace' },
      items: [
        { name: 'Noise Cancelling Headphones', price: 79.99, quantity: 1, image: '/images/products/headphones.png' },
        { name: 'Linen Casual Shirt', price: 29.99, quantity: 1, image: '/images/products/linen-shirt.png' }
      ],
      total: 109.98,
      status: 'Shipped',
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      _id: 'ord_2',
      orderNumber: 'VIVA-8742',
      customer: { name: 'Sophia Chen', email: 'sophia@example.com', city: 'Seattle', address: '120 Pike St' },
      items: [
        { name: 'Compact Coffee Maker', price: 48.99, quantity: 1, image: '/images/products/coffee-maker.png' }
      ],
      total: 51.93,
      status: 'Processing',
      paymentMethod: 'Apple Pay',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ];

  return demoOrders.filter(o => o.customer?.email?.toLowerCase() === cleanEmail);
}

// 1. GET /login
exports.getLoginPage = (req, res) => {
  if (req.session && req.session.customer) {
    return res.redirect('/account');
  }

  res.render('pages/login', {
    title: 'Sign In — ViVA (Live Better)',
    activePage: 'account',
    error: req.query.error || null,
    success: req.query.msg || null,
    redirect: req.query.redirect || '/account'
  });
};

// 2. POST /login
exports.postLogin = async (req, res) => {
  const { email, password, redirect } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();
  const targetRedirect = (redirect && redirect.startsWith('/')) ? redirect : '/account';

  if (!cleanEmail || !password) {
    return res.render('pages/login', {
      title: 'Sign In — ViVA (Live Better)',
      activePage: 'account',
      error: 'Please enter both your email address and password.',
      success: null,
      redirect: targetRedirect
    });
  }

  try {
    let customer = null;

    // 1. Check MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        customer = await User.findOne({ email: cleanEmail });
      } catch (e) {
        console.warn('DB read fallback for customer login:', e.message);
      }
    }

    // 2. Fallback to mockData.customers
    if (!customer && mockData.customers) {
      customer = mockData.customers.find(c => c.email.toLowerCase() === cleanEmail);
    }

    if (!customer) {
      return res.render('pages/login', {
        title: 'Sign In — ViVA (Live Better)',
        activePage: 'account',
        error: 'No account found with this email address. Please check your spelling or sign up below.',
        success: null,
        redirect: targetRedirect
      });
    }

    // Check account status
    if (customer.status === 'suspended') {
      return res.render('pages/login', {
        title: 'Sign In — ViVA (Live Better)',
        activePage: 'account',
        error: 'Your account has been suspended. Please contact customer support.',
        success: null,
        redirect: targetRedirect
      });
    }

    // Verify Password
    const isValid = verifyPassword(password, customer.passwordHash, customer.salt);
    if (!isValid) {
      return res.render('pages/login', {
        title: 'Sign In — ViVA (Live Better)',
        activePage: 'account',
        error: 'Incorrect password. Please verify your password and try again.',
        success: null,
        redirect: targetRedirect
      });
    }

    // Update last login
    if (mongoose.connection.readyState === 1 && customer._id && mongoose.isValidObjectId(customer._id)) {
      try {
        await User.findByIdAndUpdate(customer._id, { lastLogin: new Date() });
      } catch (e) {
        // ignore error
      }
    }

    // Set Customer Session
    req.session.customer = {
      id: String(customer._id),
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      avatarUrl: customer.avatarUrl || '/images/avatars/sarah.jpg',
      address: (customer.addresses && customer.addresses.length > 0) ? customer.addresses[0] : null
    };

    req.session.save((saveErr) => {
      if (saveErr) console.warn('Session save warning:', saveErr);
      res.redirect(targetRedirect);
    });
  } catch (err) {
    console.error('Customer login error:', err);
    res.render('pages/login', {
      title: 'Sign In — ViVA (Live Better)',
      activePage: 'account',
      error: 'An unexpected authentication error occurred. Please try again.',
      success: null,
      redirect: targetRedirect
    });
  }
};

// 3. GET /register
exports.getRegisterPage = (req, res) => {
  if (req.session && req.session.customer) {
    return res.redirect('/account');
  }

  res.render('pages/register', {
    title: 'Create Account — ViVA (Live Better)',
    activePage: 'account',
    error: null,
    redirect: req.query.redirect || '/account',
    formData: {}
  });
};

// 4. POST /register
exports.postRegister = async (req, res) => {
  const { name, email, phone, password, confirmPassword, redirect } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanName = (name || '').trim();
  const targetRedirect = (redirect && redirect.startsWith('/')) ? redirect : '/account';

  const formData = { name: cleanName, email: cleanEmail, phone: (phone || '').trim() };

  // Validation
  if (!cleanName || cleanName.length < 2) {
    return res.render('pages/register', {
      title: 'Create Account — ViVA (Live Better)',
      activePage: 'account',
      error: 'Please enter your full name (at least 2 characters).',
      redirect: targetRedirect,
      formData
    });
  }

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return res.render('pages/register', {
      title: 'Create Account — ViVA (Live Better)',
      activePage: 'account',
      error: 'Please enter a valid email address.',
      redirect: targetRedirect,
      formData
    });
  }

  if (!password || password.length < 6) {
    return res.render('pages/register', {
      title: 'Create Account — ViVA (Live Better)',
      activePage: 'account',
      error: 'Password must be at least 6 characters long.',
      redirect: targetRedirect,
      formData
    });
  }

  if (password !== confirmPassword) {
    return res.render('pages/register', {
      title: 'Create Account — ViVA (Live Better)',
      activePage: 'account',
      error: 'Passwords do not match. Please re-enter identical passwords.',
      redirect: targetRedirect,
      formData
    });
  }

  try {
    // Check for existing user
    let existing = null;
    if (mongoose.connection.readyState === 1) {
      try {
        existing = await User.findOne({ email: cleanEmail });
      } catch (e) {
        console.warn('DB check fallback for customer register:', e.message);
      }
    }

    if (!existing && mockData.customers) {
      existing = mockData.customers.find(c => c.email.toLowerCase() === cleanEmail);
    }

    if (existing) {
      return res.render('pages/register', {
        title: 'Create Account — ViVA (Live Better)',
        activePage: 'account',
        error: 'An account with this email address already exists. Please sign in instead.',
        redirect: targetRedirect,
        formData
      });
    }

    // Hash password with salt
    const { hash, salt } = hashPassword(password);

    const newCustomer = {
      _id: 'cust_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: (phone || '').trim(),
      passwordHash: hash,
      salt: salt,
      avatarUrl: '/images/avatars/sarah.jpg',
      addresses: [],
      status: 'active',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await User.create(newCustomer);
      } catch (e) {
        console.warn('DB user insert warning:', e.message);
      }
    }

    if (!mockData.customers) mockData.customers = [];
    mockData.customers.push(newCustomer);

    // Auto-login new customer
    req.session.customer = {
      id: String(newCustomer._id),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      avatarUrl: newCustomer.avatarUrl,
      address: null
    };

    req.session.save((saveErr) => {
      if (saveErr) console.warn('Session save warning:', saveErr);
      res.redirect(targetRedirect);
    });
  } catch (err) {
    console.error('Customer register error:', err);
    res.render('pages/register', {
      title: 'Create Account — ViVA (Live Better)',
      activePage: 'account',
      error: 'An unexpected error occurred during account creation. Please try again.',
      redirect: targetRedirect,
      formData
    });
  }
};

// 5. GET /logout
exports.logout = (req, res) => {
  if (req.session) {
    req.session.customer = null;
    return req.session.save(() => {
      res.redirect('/login?msg=You+have+been+signed+out+successfully');
    });
  }
  res.redirect('/login?msg=You+have+been+signed+out+successfully');
};


// 6. GET /account
exports.getAccountPage = async (req, res) => {
  const sessionCust = req.session.customer;
  if (!sessionCust) {
    return res.redirect('/login');
  }

  try {
    let customer = null;

    if (mongoose.connection.readyState === 1) {
      try {
        customer = await User.findOne({ email: sessionCust.email.toLowerCase() });
      } catch (e) {
        console.warn('DB fetch customer error:', e.message);
      }
    }

    if (!customer && mockData.customers) {
      customer = mockData.customers.find(c => c.email.toLowerCase() === sessionCust.email.toLowerCase());
    }

    if (!customer) {
      customer = {
        name: sessionCust.name,
        email: sessionCust.email,
        phone: sessionCust.phone || '',
        avatarUrl: sessionCust.avatarUrl,
        addresses: sessionCust.address ? [sessionCust.address] : [],
        createdAt: new Date()
      };
    }

    // Fetch customer's orders
    let orders = [];
    if (mongoose.connection.readyState === 1) {
      try {
        orders = await Order.find({ 'customer.email': sessionCust.email.toLowerCase() }).sort({ createdAt: -1 });
      } catch (e) {
        console.warn('DB fetch orders for customer error:', e.message);
      }
    }

    if (!orders || orders.length === 0) {
      orders = getCustomerOrdersFallback(sessionCust.email);
    }

    // Calculate customer lifetime metrics
    const totalSpent = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const activeOrders = orders.filter(o => o.status === 'Ordered' || o.status === 'Processing' || o.status === 'Shipped').length;

    res.render('pages/account', {
      title: `My Account — ${customer.name} | ViVA`,
      activePage: 'account',
      customer,
      orders,
      stats: {
        totalOrders: orders.length,
        totalSpent: totalSpent.toFixed(2),
        activeOrders
      },
      activeTab: req.query.tab || 'overview',
      message: req.query.msg || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Customer account page error:', err);
    res.status(500).send('Error loading account dashboard');
  }
};

// 7. POST /account/profile
exports.postUpdateProfile = async (req, res) => {
  const sessionCust = req.session.customer;
  if (!sessionCust) return res.redirect('/login');

  const { name, phone } = req.body;
  const cleanName = (name || '').trim();
  const cleanPhone = (phone || '').trim();

  if (!cleanName) {
    return res.redirect('/account?tab=security&error=Name+cannot+be+empty');
  }

  try {
    if (mongoose.connection.readyState === 1) {
      await User.findOneAndUpdate({ email: sessionCust.email.toLowerCase() }, { name: cleanName, phone: cleanPhone });
    }

    const mockCust = mockData.customers?.find(c => c.email.toLowerCase() === sessionCust.email.toLowerCase());
    if (mockCust) {
      mockCust.name = cleanName;
      mockCust.phone = cleanPhone;
    }

    sessionCust.name = cleanName;
    sessionCust.phone = cleanPhone;

    res.redirect('/account?tab=security&msg=Personal+profile+updated+successfully');
  } catch (err) {
    console.error('Update profile error:', err);
    res.redirect('/account?tab=security&error=Error+updating+profile');
  }
};

// 8. POST /account/password
exports.postUpdatePassword = async (req, res) => {
  const sessionCust = req.session.customer;
  if (!sessionCust) return res.redirect('/login');

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.redirect('/account?tab=security&error=New+password+must+be+at+least+6+characters');
  }

  if (newPassword !== confirmNewPassword) {
    return res.redirect('/account?tab=security&error=New+passwords+do+not+match');
  }

  try {
    let customer = null;
    if (mongoose.connection.readyState === 1) {
      customer = await User.findOne({ email: sessionCust.email.toLowerCase() });
    }
    if (!customer && mockData.customers) {
      customer = mockData.customers.find(c => c.email.toLowerCase() === sessionCust.email.toLowerCase());
    }

    if (!customer) {
      return res.redirect('/account?tab=security&error=Customer+account+not+found');
    }

    const isCurrentValid = verifyPassword(currentPassword, customer.passwordHash, customer.salt);
    if (!isCurrentValid) {
      return res.redirect('/account?tab=security&error=Current+password+is+incorrect');
    }

    const { hash, salt } = hashPassword(newPassword);
    customer.passwordHash = hash;
    customer.salt = salt;

    if (mongoose.connection.readyState === 1 && customer.save) {
      await customer.save();
    }

    res.redirect('/account?tab=security&msg=Password+changed+successfully');
  } catch (err) {
    console.error('Update password error:', err);
    res.redirect('/account?tab=security&error=Error+updating+password');
  }
};

// 9. POST /account/address
exports.postAddAddress = async (req, res) => {
  const sessionCust = req.session.customer;
  if (!sessionCust) return res.redirect('/login');

  const { street, city, state, zip, country } = req.body;

  const newAddress = {
    street: (street || '').trim(),
    city: (city || '').trim(),
    state: (state || '').trim(),
    zip: (zip || '').trim(),
    country: (country || 'United States').trim(),
    isDefault: true
  };

  try {
    if (mongoose.connection.readyState === 1) {
      await User.findOneAndUpdate(
        { email: sessionCust.email.toLowerCase() },
        { $set: { addresses: [newAddress] } }
      );
    }


    const mockCust = mockData.customers?.find(c => c.email.toLowerCase() === sessionCust.email.toLowerCase());
    if (mockCust) {
      mockCust.addresses = [newAddress];
    }

    sessionCust.address = newAddress;

    res.redirect('/account?tab=addresses&msg=Shipping+address+saved+successfully');
  } catch (err) {
    console.error('Update address error:', err);
    res.redirect('/account?tab=addresses&error=Error+saving+address');
  }
};
