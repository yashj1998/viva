const mockData = require('../seeds/mock-data');

// Default initial cart items matching the initial badge count (2)
function getCartItems(session) {
  if (!session.cartItems || session.cartItems.length === 0) {
    session.cartItems = [
      {
        id: '1',
        name: 'Noise Cancelling Headphones',
        slug: 'noise-cancelling-headphones',
        price: 79.99,
        originalPrice: 99.99,
        quantity: 1,
        image: '/images/products/headphones.png',
        category: 'Electronics'
      },
      {
        id: '2',
        name: 'Linen Casual Shirt',
        slug: 'linen-casual-shirt',
        price: 29.99,
        originalPrice: 39.99,
        quantity: 1,
        image: '/images/products/linen-shirt.png',
        category: 'Fashion'
      }
    ];
  }
  return session.cartItems;
}

// Default initial wishlist items matching the initial badge count (3)
function getWishlistItems(session) {
  if (!session.wishlistItems || session.wishlistItems.length === 0) {
    session.wishlistItems = [
      {
        id: '3',
        name: 'Minimalist Niacinamide Serum',
        slug: 'minimalist-niacinamide-serum',
        price: 16.99,
        originalPrice: 19.99,
        discountPercent: 15,
        ratingAvg: 4.9,
        image: '/images/products/serum.png',
        inStock: true
      },
      {
        id: '4',
        name: 'Compact Coffee Maker',
        slug: 'compact-coffee-maker',
        price: 48.99,
        originalPrice: 69.99,
        discountPercent: 30,
        ratingAvg: 4.7,
        image: '/images/products/coffee-maker.png',
        inStock: true
      },
      {
        id: '5',
        name: 'Urban Travel Backpack',
        slug: 'urban-travel-backpack',
        price: 39.99,
        originalPrice: 49.99,
        discountPercent: 20,
        ratingAvg: 4.8,
        image: '/images/products/backpack.png',
        inStock: true
      }
    ];
  }
  return session.wishlistItems;
}

// 1. Cart Page
exports.getCartPage = (req, res) => {
  const cartItems = getCartItems(req.session);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 49;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 5.99;
  const tax = Number((subtotal * 0.06).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  res.render('pages/cart', {
    title: 'Your Shopping Cart — ViVA (Live Better)',
    activePage: 'cart',
    cartItems,
    subtotal: subtotal.toFixed(2),
    shippingFee: shippingFee.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    progressPercent,
    freeShippingThreshold,
    cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    wishlistCount: req.session.wishlistCount || 3
  });
};

// Add item to cart
exports.addToCart = (req, res) => {
  const { id, productId, quantity } = req.body;
  const targetId = id || productId || '1';
  const qty = parseInt(quantity) || 1;

  const cart = getCartItems(req.session);
  const existing = cart.find(i => i.id === String(targetId));

  if (existing) {
    existing.quantity += qty;
  } else {
    const p = (mockData.products || []).find(pr => String(pr._id) === String(targetId) || String(pr.id) === String(targetId));
    cart.push({
      id: String(targetId),
      name: p ? p.name : 'ViVA Modern Living Item',
      slug: p ? p.slug : 'viva-product',
      price: p ? p.salePrice : 29.99,
      originalPrice: p ? (p.regularPrice || p.salePrice) : 39.99,
      quantity: qty,
      image: p ? (p.images && p.images[0]) || '/images/products/headphones.png' : '/images/products/headphones.png',
      category: p ? p.category : 'General'
    });
  }

  req.session.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('json')) || (req.headers['content-type'] && req.headers['content-type'].includes('json'))) {
    return res.json({
      success: true,
      cartCount: req.session.cartCount,
      message: 'Item added to cart!'
    });
  }
  res.redirect('/cart');
};

// Update item quantity in cart
exports.updateCartItem = (req, res) => {
  const { id, action } = req.body;
  const cartItems = getCartItems(req.session);
  const item = cartItems.find(i => i.id === id);

  if (item) {
    if (action === 'increment') {
      item.quantity += 1;
    } else if (action === 'decrement') {
      item.quantity = Math.max(1, item.quantity - 1);
    } else if (action === 'remove') {
      req.session.cartItems = cartItems.filter(i => i.id !== id);
    }
  }

  req.session.cartCount = (req.session.cartItems || cartItems).reduce((sum, i) => sum + i.quantity, 0);
  res.redirect('/cart');
};

// 2. Wishlist Page
exports.getWishlistPage = (req, res) => {
  const wishlistItems = getWishlistItems(req.session);

  res.render('pages/wishlist', {
    title: 'Saved Wishlist — ViVA (Live Better)',
    activePage: 'wishlist',
    wishlistItems,
    cartCount: req.session.cartCount || 2,
    wishlistCount: wishlistItems.length
  });
};

// Remove or move item from wishlist
exports.updateWishlist = (req, res) => {
  const { id, action } = req.body;
  let wishlist = getWishlistItems(req.session);

  if (action === 'remove') {
    req.session.wishlistItems = wishlist.filter(i => i.id !== id);
  } else if (action === 'move-to-cart') {
    const item = wishlist.find(i => i.id === id);
    if (item) {
      const cart = getCartItems(req.session);
      cart.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: 1,
        image: item.image,
        category: 'Essentials'
      });
      req.session.wishlistItems = wishlist.filter(i => i.id !== id);
      req.session.cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    }
  }

  req.session.wishlistCount = (req.session.wishlistItems || []).length;
  res.redirect('/wishlist');
};

const mongoose = require('mongoose');
const Order = require('../models/Order');

// 3. Checkout Page
exports.getCheckoutPage = (req, res) => {
  const cartItems = getCartItems(req.session);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 49 ? 0 : 5.99;
  const tax = Number((subtotal * 0.06).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));
  const customer = req.session.customer || null;

  res.render('pages/checkout', {
    title: 'Secure Checkout — ViVA',
    activePage: 'cart',
    cartItems,
    customer,
    subtotal: subtotal.toFixed(2),
    shippingFee: shippingFee.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    cartCount: req.session.cartCount || 2,
    wishlistCount: req.session.wishlistCount || 3
  });
};

// 4. Place Order / Confirmation
exports.processCheckout = async (req, res) => {
  const { firstName, lastName, email, phone, address, city, zip, country, paymentMethod } = req.body;
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `VIVA-${randomNum}`;
  const customer = req.session.customer || null;

  const customerName = `${firstName || (customer ? customer.name.split(' ')[0] : 'Valued')} ${lastName || (customer ? customer.name.split(' ')[1] || '' : 'Customer')}`.trim();
  const customerEmail = (email || (customer ? customer.email : 'customer@example.com')).toLowerCase().trim();
  const fullAddress = `${address || '123 Main St'}, ${city || 'City'}, ${zip || '10001'}`;
  const totalAmount = parseFloat(req.body.totalAmount) || 109.98;

  const placedOrder = {
    orderNumber,
    customerName,
    email: customerEmail,
    address: fullAddress,
    paymentMethod: paymentMethod || 'Credit Card',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    items: req.session.cartItems || [],
    total: totalAmount.toFixed(2)
  };

  // Persist order in DB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      await Order.create({
        orderNumber,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: phone || (customer ? customer.phone : ''),
          address: address || '123 Main St',
          city: city || 'City',
          zip: zip || '10001',
          country: country || 'United States'
        },
        items: (req.session.cartItems || []).map(i => ({
          productId: i.id || i.slug || 'prod',
          name: i.name,
          price: i.price,
          quantity: i.quantity || 1,
          image: i.image || '/images/products/headphones.png'
        })),
        subtotal: totalAmount,
        shippingFee: 0,
        tax: 0,
        total: totalAmount,
        status: 'Processing',
        paymentMethod: paymentMethod || 'Credit Card'
      });
    } catch (err) {
      console.warn('DB order save warning:', err.message);
    }
  }

  // Reset cart after checkout
  req.session.cartItems = [];
  req.session.cartCount = 0;

  res.render('pages/order-confirmation', {
    title: `Order Confirmed: ${orderNumber} — ViVA`,
    activePage: 'home',
    order: placedOrder,
    cartCount: 0,
    wishlistCount: req.session.wishlistCount || 3
  });
};

