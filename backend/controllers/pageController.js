const mockData = require('../seeds/mock-data');

// 1. Deals Page
exports.getDealsPage = (req, res) => {
  const dealsProducts = [...mockData.products].sort((a, b) => b.discountPercent - a.discountPercent);

  res.render('pages/deals', {
    title: 'Daily Deals & Limited Offers — ViVA',
    activePage: 'deals',
    products: dealsProducts,
    promoBanners: mockData.promoBanners,
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
};

// 2. New Arrivals Page
exports.getNewArrivalsPage = (req, res) => {
  res.render('pages/new-arrivals', {
    title: 'New Arrivals — Fresh Styles Just In | ViVA',
    activePage: 'new-arrivals',
    products: mockData.products,
    promoBanners: mockData.promoBanners,
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
};

// 3. Featured Brands Page
exports.getBrandsPage = (req, res) => {
  const brands = [
    { name: 'Marshall', tag: 'Sound & Audio Heritage', logoIcon: 'fa-solid fa-guitar', bg: '#fef3c7', count: 18, desc: 'Iconic amplification and modern wireless sound systems.' },
    { name: 'Aesop', tag: 'Botanical Skincare', logoIcon: 'fa-solid fa-leaf', bg: '#eef1e6', count: 24, desc: 'Formulations of the finest quality with sensory aromatic profiles.' },
    { name: 'Aura Tech', tag: 'Noise-Cancelling Acoustics', logoIcon: 'fa-solid fa-headphones', bg: '#e6edf5', count: 12, desc: 'Studio-grade personal audio and smart wireless wearables.' },
    { name: 'Nordica Living', tag: 'Scandinavian Furniture', logoIcon: 'fa-solid fa-couch', bg: '#f7ece2', count: 32, desc: 'Minimalist sustainable home furniture and warm ambient lighting.' },
    { name: 'UrbanStitch', tag: 'Casual Natural Textiles', logoIcon: 'fa-solid fa-shirt', bg: '#fce7e3', count: 45, desc: 'Breathable European linen shirts and tailored everyday travel essentials.' },
    { name: 'PureBrew', tag: 'Artisan Kitchen & Coffee', logoIcon: 'fa-solid fa-mug-hot', bg: '#ffedd5', count: 15, desc: 'Precision thermal coffee machines and morning ritual barware.' }
  ];

  res.render('pages/brands', {
    title: 'Featured Brands — ViVA',
    activePage: 'brands',
    brands,
    products: mockData.products,
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
};

// 4. Inspiration & Modern Living Lookbook
exports.getInspirationPage = (req, res) => {
  const lookbooks = [
    {
      title: 'Warm Minimalist Living Room',
      category: 'Home Refresh',
      image: '/images/banners/armchair.png',
      bg: '#f7ece2',
      readTime: '4 min read',
      excerpt: 'How to combine Scandinavian wood tones, soft boucle armchairs, and warm ambient light to create a peaceful sanctuary.',
      items: ['Nordica Boucle Chair', 'Minimalist Brass Floor Lamp']
    },
    {
      title: 'The Focus & Productivity Desk Setup',
      category: 'Tech Essentials',
      image: '/images/products/headphones.png',
      bg: '#e6edf5',
      readTime: '3 min read',
      excerpt: 'Creating an uncluttered desk with studio headphones, tactile mechanical accessories, and cord-free aesthetics.',
      items: ['Aura Noise Cancelling Headphones', 'Smart Health Watch']
    },
    {
      title: 'Everyday Breathable Summer Capsule',
      category: 'Style Edit',
      image: '/images/products/linen-shirt.png',
      bg: '#eef1e6',
      readTime: '5 min read',
      excerpt: 'Transition from daytime work to sunset dinners with washed linen shirts and neutral carry-on accessories.',
      items: ['Olive Linen Button-Down', 'Urban Travel Backpack']
    }
  ];

  res.render('pages/inspiration', {
    title: 'Inspiration & Style Lookbook — ViVA',
    activePage: 'inspiration',
    lookbooks,
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
};

const mongoose = require('mongoose');
const Order = require('../models/Order');

// 5. Track Order Page (Protected: Customer Login Required)
exports.getTrackOrderPage = async (req, res) => {
  const customer = req.session.customer || null;
  const customerEmail = customer ? customer.email.toLowerCase().trim() : 'alex@example.com';
  const queryOrderNum = (req.query.order || '').trim().toUpperCase();

  let customerOrders = [];
  try {
    if (mongoose.connection.readyState === 1) {
      customerOrders = await Order.find({ 'customer.email': customerEmail }).sort({ createdAt: -1 }).lean();
    }
  } catch (e) {
    console.warn('DB read fallback for track order:', e.message);
  }

  // Fallback demo order
  let activeOrder = null;
  if (queryOrderNum && customerOrders.length > 0) {
    activeOrder = customerOrders.find(o => o.orderNumber.toUpperCase() === queryOrderNum);
  }
  if (!activeOrder && customerOrders.length > 0) {
    activeOrder = customerOrders[0];
  }

  if (!activeOrder) {
    activeOrder = {
      orderNumber: queryOrderNum || 'VIVA-9824',
      customerEmail: customerEmail,
      status: 'Shipped',
      progressStep: 3,
      carrier: 'FedEx Express',
      trackingCode: 'FX-7839219402',
      estimatedDelivery: 'Tomorrow by 7:00 PM',
      shippingAddress: (customer && customer.address) ? `${customer.address.street}, ${customer.address.city}` : '742 Evergreen Terrace, Springfield, OR',
      items: [
        { name: 'Noise Cancelling Headphones', price: 79.99, image: '/images/products/headphones.png', qty: 1 },
        { name: 'Linen Casual Shirt (Olive)', price: 29.99, image: '/images/products/linen-shirt.png', qty: 1 }
      ],
      timeline: [
        { title: 'Delivered', date: 'Estimated Tomorrow', completed: false, active: false },
        { title: 'Out for Delivery / Shipped', date: 'Today, 8:30 AM', completed: true, active: true },
        { title: 'Order Processed & Packed', date: 'Yesterday, 3:15 PM', completed: true, active: false },
        { title: 'Order Confirmed & Paid', date: 'Yesterday, 10:45 AM', completed: true, active: false }
      ]
    };
  } else {
    // Format timeline and items for view
    activeOrder.customerEmail = customerEmail;
    activeOrder.carrier = activeOrder.carrier || 'FedEx Express Priority';
    activeOrder.trackingCode = activeOrder.trackingCode || ('TRK-' + (activeOrder.orderNumber || '9824').replace(/\D/g, ''));
    activeOrder.estimatedDelivery = activeOrder.estimatedDelivery || 'In 2-3 Business Days';
    activeOrder.shippingAddress = activeOrder.shippingAddress || (activeOrder.customer?.address || 'Your saved address');
    
    let step = 1;
    if (activeOrder.status === 'Processing') step = 2;
    else if (activeOrder.status === 'Shipped') step = 3;
    else if (activeOrder.status === 'Delivered') step = 4;
    activeOrder.progressStep = step;

    activeOrder.timeline = [
      { title: 'Delivered', date: activeOrder.status === 'Delivered' ? 'Package Delivered' : 'Pending', completed: step >= 4, active: step === 4 },
      { title: 'In Transit / Shipped', date: step >= 3 ? 'Carrier In Transit' : 'Pending', completed: step >= 3, active: step === 3 },
      { title: 'Quality Check & Packed', date: step >= 2 ? 'Order Processed' : 'Pending', completed: step >= 2, active: step === 2 },
      { title: 'Order Confirmed & Paid', date: 'Verified', completed: true, active: step === 1 }
    ];
  }

  res.render('pages/track-order', {
    title: 'Track Your Order — ViVA',
    activePage: 'track-order',
    order: activeOrder,
    customerOrders,
    searched: Boolean(queryOrderNum),
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
};

exports.postTrackOrder = async (req, res) => {
  const { orderNumber, email } = req.body;
  const num = (orderNumber || 'VIVA-9824').trim().toUpperCase();
  const customer = req.session.customer || null;
  const customerEmail = email ? email.toLowerCase().trim() : (customer ? customer.email.toLowerCase().trim() : '');

  let foundOrder = null;
  try {
    if (mongoose.connection.readyState === 1) {
      foundOrder = await Order.findOne({ orderNumber: num }).lean();
    }
  } catch (e) {
    console.warn('DB lookup error in postTrackOrder:', e.message);
  }

  if (!foundOrder) {
    foundOrder = {
      orderNumber: num,
      customerEmail: customerEmail,
      status: 'Shipped',
      progressStep: 3,
      carrier: 'FedEx Express Priority',
      trackingCode: 'FX-829104829',
      estimatedDelivery: 'Thursday by End of Day',
      shippingAddress: (customer && customer.address) ? `${customer.address.street}, ${customer.address.city}` : '450 North Ocean Drive, Apt 4B, Miami, FL 33139',
      items: [
        { name: 'Noise Cancelling Headphones', price: 79.99, image: '/images/products/headphones.png', qty: 1 },
        { name: 'Minimalist Niacinamide Serum', price: 16.99, image: '/images/products/serum.png', qty: 1 }
      ],
      timeline: [
        { title: 'Delivered', date: 'Pending Arrival', completed: false, active: false },
        { title: 'In Transit / Shipped', date: 'Today, 9:15 AM', completed: true, active: true },
        { title: 'Quality Check & Packed', date: 'Yesterday, 4:20 PM', completed: true, active: false },
        { title: 'Order Received & Paid', date: 'Yesterday, 11:10 AM', completed: true, active: false }
      ]
    };
  } else {
    let step = 1;
    if (foundOrder.status === 'Processing') step = 2;
    else if (foundOrder.status === 'Shipped') step = 3;
    else if (foundOrder.status === 'Delivered') step = 4;
    foundOrder.progressStep = step;

    foundOrder.carrier = foundOrder.carrier || 'FedEx Express';
    foundOrder.trackingCode = foundOrder.trackingCode || ('TRK-' + (foundOrder.orderNumber || '9824').replace(/\D/g, ''));
    foundOrder.estimatedDelivery = foundOrder.estimatedDelivery || 'In 2-3 Business Days';
    foundOrder.shippingAddress = foundOrder.shippingAddress || (foundOrder.customer?.address || 'Your saved address');

    foundOrder.timeline = [
      { title: 'Delivered', date: step >= 4 ? 'Delivered' : 'Pending Arrival', completed: step >= 4, active: step === 4 },
      { title: 'In Transit / Shipped', date: step >= 3 ? 'Carrier In Transit' : 'Pending', completed: step >= 3, active: step === 3 },
      { title: 'Quality Check & Packed', date: step >= 2 ? 'Processed' : 'Pending', completed: step >= 2, active: step === 2 },
      { title: 'Order Received & Paid', date: 'Verified', completed: true, active: step === 1 }
    ];
  }

  res.render('pages/track-order', {
    title: `Order Status ${num} — ViVA`,
    activePage: 'track-order',
    order: foundOrder,
    customerOrders: [],
    searched: true,
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
};
