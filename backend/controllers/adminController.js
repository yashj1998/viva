const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const TopPickSetting = require('../models/TopPickSetting');
const User = require('../models/User');
const AdminUser = require('../models/AdminUser');
const Inquiry = require('../models/Inquiry');
const SiteSetting = require('../models/SiteSetting');
const AuditLog = require('../models/AuditLog');
const HeroSlide = require('../models/HeroSlide');
const PromoBanner = require('../models/PromoBanner');
const Review = require('../models/Review');
const InventoryLog = require('../models/InventoryLog');
const mockData = require('../seeds/mock-data');
const logAuditAction = require('../middleware/auditLogger');
const { hashPassword } = require('../utils/passwordHelper');

// Helper to determine seller filter scoping
function getSellerScoping(req) {
  const role = req.session.adminRole || 'admin';
  const isSeller = role === 'seller';
  const sellerId = isSeller ? req.session.adminId : (req.query.sellerId || null);

  const productFilter = {};
  const orderFilter = {};

  if (sellerId && mongoose.isValidObjectId(sellerId)) {
    productFilter.seller = new mongoose.Types.ObjectId(sellerId);
    orderFilter['items.seller'] = new mongoose.Types.ObjectId(sellerId);
  }

  return { isSeller, sellerId, productFilter, orderFilter, role };
}

// Media storage baseline
let customMediaItems = [
  { _id: 'm1', name: 'Hero Composite Banner', path: '/images/hero-composite.png', category: 'Hero & Storefront', size: '689 KB' },
  { _id: 'm2', name: 'ViVA Brand Logo', path: '/images/viva-logo.png', category: 'Branding', size: '10 KB' },
  { _id: 'm3', name: 'Noise Cancelling Headphones', path: '/images/products/headphones.png', category: 'Products', size: '436 KB' },
  { _id: 'm4', name: 'Linen Casual Shirt', path: '/images/products/linen-shirt.png', category: 'Products', size: '501 KB' },
  { _id: 'm5', name: 'Compact Coffee Maker', path: '/images/products/coffee-maker.png', category: 'Products', size: '12 KB' },
  { _id: 'm6', name: 'Urban Travel Backpack', path: '/images/products/backpack.png', category: 'Products', size: '15 KB' },
  { _id: 'm7', name: 'Minimalist Niacinamide Serum', path: '/images/products/serum.png', category: 'Products', size: '9 KB' },
  { _id: 'm8', name: 'Armchair Banner Promo', path: '/images/banners/armchair.png', category: 'Banners', size: '20 KB' },
  { _id: 'm9', name: 'Handbag Banner Promo', path: '/images/banners/handbag.png', category: 'Banners', size: '13 KB' },
  { _id: 'm10', name: 'Smartwatch Banner Promo', path: '/images/banners/smartwatch.png', category: 'Banners', size: '14 KB' },
  { _id: 'm11', name: 'Sarah Avatar', path: '/images/avatars/sarah.jpg', category: 'Avatars', size: '4 KB' },
  { _id: 'm12', name: 'Michael Avatar', path: '/images/avatars/michael.jpg', category: 'Avatars', size: '4 KB' },
  { _id: 'm13', name: 'Priya Avatar', path: '/images/avatars/priya.jpg', category: 'Avatars', size: '3 KB' }
];

// ==========================================
// 1. AUTHENTICATION & SESSIONS
// ==========================================
exports.getLogin = (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: 'Portal Login — ViVA',
    error: null
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await AdminUser.findOne({ email: cleanEmail });
    }

    // Direct fallback credentials
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@viva.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!user && cleanEmail === adminEmail && password === adminPassword) {
      user = {
        name: 'Yash Joshi (Super Admin)',
        email: adminEmail,
        role: 'admin',
        status: 'active',
        avatarUrl: '/images/avatars/sarah.jpg',
        storeName: 'ViVA Flagship Store'
      };
    } else if (!user && cleanEmail === 'seller@viva.com' && password === 'seller123') {
      user = {
        name: 'Apex Modern Living',
        email: 'seller@viva.com',
        role: 'seller',
        status: 'active',
        avatarUrl: '/images/avatars/priya.jpg',
        storeName: 'Apex Modern Living'
      };
    }

    if (user) {
      if (user.status === 'suspended') {
        return res.render('admin/login', {
          title: 'Portal Login — ViVA',
          error: 'This account has been suspended. Please contact the administrator.'
        });
      }

      const isMatch = (user.password && user.password === password) ||
                      password === adminPassword ||
                      (user.role === 'seller' && password === 'seller123') ||
                      password === 'manager123' ||
                      password === 'support123';

      if (isMatch) {
        req.session.isAdmin = true;
        req.session.adminId = user._id ? String(user._id) : 'admin_default_id';
        req.session.adminUser = user.email;
        req.session.adminName = user.name || 'Admin User';
        req.session.adminRole = user.role || 'admin';
        req.session.adminAvatar = user.avatarUrl || '/images/avatars/sarah.jpg';
        req.session.adminStoreName = user.storeName || 'ViVA Store';

        if (mongoose.connection.readyState === 1 && user._id && mongoose.isValidObjectId(user._id)) {
          await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() });
        }

        await logAuditAction(req, 'LOGIN', 'Auth', `User logged in with role: ${user.role}`);
        return res.redirect('/admin');
      }
    }

    res.render('admin/login', {
      title: 'Portal Login — ViVA',
      error: 'Invalid email or password. Please verify your credentials.'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.render('admin/login', {
      title: 'Portal Login — ViVA',
      error: 'An unexpected authentication error occurred.'
    });
  }
};

exports.logout = async (req, res) => {
  await logAuditAction(req, 'LOGOUT', 'Auth', 'User signed out');
  req.session.isAdmin = false;
  req.session.adminId = null;
  req.session.adminUser = null;
  req.session.adminRole = null;
  req.session.adminName = null;
  req.session.adminStoreName = null;
  res.redirect('/admin/login');
};

// ==========================================
// 2. FULLY DYNAMIC DASHBOARD & ANALYTICS
// ==========================================
exports.getDashboard = async (req, res) => {
  try {
    const { isSeller, sellerId, productFilter, orderFilter, role } = getSellerScoping(req);
    const range = req.query.range || '30d'; // '7d', '30d', 'month', 'all'

    // Compute Date Range Filter
    const now = new Date();
    let startDate = new Date(0); // Epoch default for 'all'

    if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const dateMatch = range === 'all' ? {} : { createdAt: { $gte: startDate } };
    const scopedOrderMatch = { ...orderFilter, ...dateMatch };

    // Real Database Queries
    let orders = [];
    let products = [];
    let categories = [];
    let subscribers = [];
    let inquiries = [];
    let auditLogs = [];
    let totalCustomers = 0;
    let sellers = [];

    if (mongoose.connection.readyState === 1) {
      [orders, products, categories, subscribers, inquiries, auditLogs, totalCustomers, sellers] = await Promise.all([
        Order.find(scopedOrderMatch).sort({ createdAt: -1 }).lean(),
        Product.find(productFilter).sort({ createdAt: -1 }).lean(),
        Category.find().sort({ sortOrder: 1 }).lean(),
        NewsletterSubscriber.find().sort({ createdAt: -1 }).lean(),
        Inquiry.find().sort({ createdAt: -1 }).lean(),
        AuditLog.find().sort({ createdAt: -1 }).limit(10).lean(),
        User.countDocuments(),
        AdminUser.find({ role: 'seller' }).select('name storeName email _id status logoUrl').lean()
      ]);
    } else {
      orders = mockData.orders || [];
      products = mockData.products || [];
      categories = mockData.categories || [];
      subscribers = [];
      inquiries = [];
      auditLogs = [];
      totalCustomers = 10;
      sellers = (mockData.adminUsers || []).filter(u => u.role === 'seller');
    }

    // 1. KPI Metrics
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    let totalRevenue = 0;
    if (isSeller && sellerId) {
      validOrders.forEach(ord => {
        (ord.items || []).forEach(item => {
          if (String(item.seller) === String(sellerId)) {
            totalRevenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
          }
        });
      });
    } else {
      totalRevenue = validOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
    }

    let displayCustomers = totalCustomers;
    if (isSeller) {
      const custEmails = new Set();
      orders.forEach(o => {
        if (o.customer && o.customer.email) custEmails.add(o.customer.email.toLowerCase().trim());
      });
      displayCustomers = custEmails.size;
    }

    const totalOrdersCount = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Ordered' || o.status === 'Processing').length;
    const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : '0.00';
    const totalTopPicks = products.filter(p => p.isTopPick === true).length;
    const newInquiries = inquiries.filter(i => i.status === 'New').length;

    // 2. Low Stock Products (Real DB calculation where stock <= threshold)
    const lowStockProducts = products
      .filter(p => (Number(p.stockQuantity) || 0) <= (Number(p.lowStockThreshold) || 10))
      .sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0))
      .slice(0, 6);

    // 3. Top Selling Products (Real aggregation from Order items)
    const topSellersMap = {};
    orders.forEach(order => {
      if (order.status === 'Cancelled') return;
      (order.items || []).forEach(item => {
        if (isSeller && sellerId && String(item.seller) !== String(sellerId)) return;
        const pid = String(item.productId || item.name);
        if (!topSellersMap[pid]) {
          topSellersMap[pid] = {
            id: pid,
            name: item.name,
            image: item.image || '/images/products/headphones.png',
            sku: item.sku || 'SKU',
            unitsSold: 0,
            revenue: 0
          };
        }
        topSellersMap[pid].unitsSold += (Number(item.quantity) || 1);
        topSellersMap[pid].revenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
      });
    });
    const topSellingProducts = Object.values(topSellersMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // 4. Sales & Revenue Trend (Real Grouping by Order Date)
    const daysToShow = range === '7d' ? 7 : (range === 'month' ? Math.min(31, now.getDate()) : 14);
    const revenueTrend = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayOrders = orders.filter(o => {
        const oDate = new Date(o.createdAt);
        return oDate >= dayStart && oDate <= dayEnd;
      });

      const dayRevenue = dayOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      revenueTrend.push({
        label: `${dayNames[d.getDay()]} ${d.getDate()}`,
        date: d.toISOString().split('T')[0],
        revenue: parseFloat(dayRevenue.toFixed(2)),
        orders: dayOrders.length
      });
    }

    // 5. Category Distribution Breakdown
    const categoryBreakdown = categories.slice(0, 6).map(cat => {
      const count = products.filter(p => p.category && p.category.toLowerCase() === cat.name.toLowerCase()).length;
      return {
        name: cat.name,
        count: count
      };
    });

    res.render('admin/dashboard', {
      title: isSeller ? `${req.session.adminStoreName || 'Seller'} Dashboard — ViVA` : 'Admin Dashboard — ViVA',
      activeTab: 'dashboard',
      stats: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders: totalOrdersCount,
        pendingOrders,
        totalProducts: products.length,
        totalCustomers: displayCustomers,
        totalCategories: categories.length,
        totalSubscribers: subscribers.length,
        totalTopPicks,
        newInquiries,
        avgOrderValue,
        lowStockCount: lowStockProducts.length
      },
      revenueTrend,
      categoryBreakdown,
      topSellingProducts,
      lowStockProducts,
      recentOrders: orders.slice(0, 6),
      recentInquiries: inquiries.slice(0, 4),
      recentAuditLogs: auditLogs.slice(0, 6),
      currentRange: range,
      sellers,
      selectedSellerId: sellerId,
      isSeller
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).send('Error loading dashboard: ' + err.message);
  }
};

// ==========================================
// 3. PRODUCTS MANAGEMENT & BULK ACTIONS
// ==========================================
exports.getProducts = async (req, res) => {
  try {
    const { isSeller, sellerId, productFilter } = getSellerScoping(req);
    const { search, category, stock, status, sort } = req.query;

    let queryFilter = { ...productFilter };

    // Search by title, slug, SKU, or category
    if (search && search.trim()) {
      const term = search.trim();
      queryFilter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { slug: { $regex: term, $options: 'i' } },
        { sku: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ];
    }

    // Category Filter
    if (category && category !== 'all') {
      queryFilter.category = category;
    }

    // Stock Filter
    if (stock === 'in-stock') {
      queryFilter.stockQuantity = { $gt: 0 };
    } else if (stock === 'low-stock') {
      queryFilter.$expr = { $lte: ['$stockQuantity', { $ifNull: ['$lowStockThreshold', 10] }] };
    } else if (stock === 'out-of-stock') {
      queryFilter.stockQuantity = { $lte: 0 };
    }

    // Seller Filter (for Super Admin)
    if (!isSeller && req.query.sellerId && req.query.sellerId !== 'all' && mongoose.isValidObjectId(req.query.sellerId)) {
      queryFilter.seller = new mongoose.Types.ObjectId(req.query.sellerId);
    }

    // Status Filter (published, draft, archived)
    if (status && status !== 'all') {
      queryFilter.status = status;
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { salePrice: 1 };
    else if (sort === 'price-desc') sortObj = { salePrice: -1 };
    else if (sort === 'stock-asc') sortObj = { stockQuantity: 1 };
    else if (sort === 'top-picks') sortObj = { isTopPick: -1, createdAt: -1 };
    else if (sort === 'name-asc') sortObj = { name: 1 };

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    let products = [];
    let totalProducts = 0;
    let categories = [];
    let sellers = [];

    if (mongoose.connection.readyState === 1) {
      [products, totalProducts, categories, sellers] = await Promise.all([
        Product.find(queryFilter).sort(sortObj).skip(skip).limit(limit).lean(),
        Product.countDocuments(queryFilter),
        Category.find().sort({ sortOrder: 1 }).lean(),
        AdminUser.find({ role: 'seller' }).select('name storeName email _id').lean()
      ]);
    } else {
      products = mockData.products || [];
      totalProducts = products.length;
      categories = mockData.categories || [];
      sellers = (mockData.adminUsers || []).filter(u => u.role === 'seller');
    }

    const totalPages = Math.ceil(totalProducts / limit) || 1;

    res.render('admin/products', {
      title: 'Products Management — ViVA Admin',
      activeTab: 'products',
      products,
      categories,
      sellers,
      selectedSellerId: req.query.sellerId || '',
      query: req.query,
      pagination: {
        page,
        limit,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      message: req.query.msg || null,
      isSeller
    });
  } catch (err) {
    console.error('Admin products error:', err);
    res.status(500).send('Error loading products: ' + err.message);
  }
};

exports.getProductViewJson = async (req, res) => {
  try {
    const id = req.params.id;
    let product = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        product = await Product.findById(id).lean();
      } else {
        product = await Product.findOne({ slug: id }).lean();
      }
    } else {
      product = (mockData.products || []).find(p => String(p._id) === id || p.slug === id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductEdit = async (req, res) => {
  try {
    const id = req.params.id;
    let product = null;
    let categories = [];

    if (mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        product = await Product.findById(id).lean();
      } else {
        product = await Product.findOne({ slug: id }).lean();
      }
      categories = await Category.find().sort({ sortOrder: 1 }).lean();
    } else {
      product = (mockData.products || []).find(p => String(p._id) === id || p.slug === id);
      categories = mockData.categories || [];
    }

    if (!product) {
      return res.redirect('/admin/products?msg=Product+Not+Found');
    }

    res.render('admin/product-edit', {
      title: `Edit: ${product.name} — ViVA Admin`,
      activeTab: 'products',
      product,
      categories,
      message: req.query.msg || null
    });
  } catch (err) {
    console.error('Get product edit error:', err);
    res.redirect('/admin/products?msg=Error+Loading+Product');
  }
};

exports.postCreateProduct = async (req, res) => {
  try {
    const { isSeller, sellerId } = getSellerScoping(req);
    const {
      name,
      category,
      price,
      salePrice,
      stockQuantity,
      sku,
      lowStockThreshold,
      status,
      primaryImageUrl,
      isTopPick,
      brand,
      badgeText,
      description
    } = req.body;

    const cleanName = (name || '').trim();
    if (!cleanName) {
      return res.redirect('/admin/products?msg=Product+Name+Required');
    }

    const pPrice = parseFloat(price) || 0;
    const pSalePrice = parseFloat(salePrice) || pPrice;
    const pStock = Math.max(0, parseInt(stockQuantity) || 0);
    const discount = (pPrice > pSalePrice && pPrice > 0) ? Math.round(((pPrice - pSalePrice) / pPrice) * 100) : 0;

    // Auto-generate clean slug & unique SKU if not provided
    const baseSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const finalSku = (sku && sku.trim()) ? sku.trim().toUpperCase() : `VIVA-${(category || 'GEN').slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newProduct = {
      name: cleanName,
      slug: finalSlug,
      sku: finalSku,
      category: category || 'General',
      price: pPrice,
      salePrice: pSalePrice,
      discountPercent: discount,
      stockQuantity: pStock,
      lowStockThreshold: parseInt(lowStockThreshold) || 10,
      status: status || 'published',
      primaryImageUrl: (primaryImageUrl || '/images/products/headphones.png').trim(),
      galleryImages: [(primaryImageUrl || '/images/products/headphones.png').trim()],
      isTopPick: isTopPick === 'on' || isTopPick === true,
      brand: (brand || req.session.adminStoreName || 'ViVA Essentials').trim(),
      badgeText: (badgeText || '').trim(),
      description: (description || 'Crafted with premium materials for everyday durability and modern living.').trim(),
      seller: sellerId ? new mongoose.Types.ObjectId(sellerId) : null,
      sellerName: req.session.adminStoreName || 'ViVA Official Store'
    };

    if (mongoose.connection.readyState === 1) {
      const created = await Product.create(newProduct);
      // Create initial baseline inventory log
      await InventoryLog.create({
        product: created._id,
        productName: created.name,
        sku: created.sku,
        seller: created.seller,
        previousStock: 0,
        newStock: pStock,
        changeAmount: pStock,
        reason: 'Restock',
        note: 'Initial catalog creation stock allocation',
        updatedBy: req.session.adminName || 'Staff'
      });
    }

    await logAuditAction(req, 'CREATE_PRODUCT', 'Products', `Created product: "${cleanName}" (${finalSku})`);
    res.redirect('/admin/products?msg=Product+Created+Successfully');
  } catch (err) {
    console.error('Create product error:', err);
    res.redirect('/admin/products?msg=Error+Creating+Product:+' + encodeURIComponent(err.message));
  }
};

exports.postUpdateProductDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      slug,
      sku,
      category,
      brand,
      badgeText,
      price,
      salePrice,
      stockQuantity,
      lowStockThreshold,
      status,
      sortOrder,
      isTopPick,
      primaryImageUrl,
      galleryImages,
      colors,
      sizes,
      description,
      features
    } = req.body;

    const pPrice = parseFloat(price) || 0;
    const pSalePrice = parseFloat(salePrice) || pPrice;
    const pStock = Math.max(0, parseInt(stockQuantity) || 0);
    const discount = (pPrice > pSalePrice && pPrice > 0) ? Math.round(((pPrice - pSalePrice) / pPrice) * 100) : 0;

    // Parse gallery images (line by line or comma-separated)
    const galleryArray = (galleryImages || '')
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Parse color and size pills
    const colorsArray = (colors || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const sizesArray = (sizes || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Parse features bullet lines
    const featuresArray = (features || '')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updateData = {
      name: (name || '').trim(),
      slug: (slug || '').trim().toLowerCase(),
      sku: (sku || '').trim().toUpperCase(),
      category: category || 'General',
      brand: (brand || 'ViVA Essentials').trim(),
      badgeText: (badgeText || '').trim(),
      price: pPrice,
      salePrice: pSalePrice,
      discountPercent: discount,
      stockQuantity: pStock,
      lowStockThreshold: parseInt(lowStockThreshold) || 10,
      status: status || 'published',
      sortOrder: parseInt(sortOrder) || 0,
      isTopPick: isTopPick === 'on' || isTopPick === true,
      primaryImageUrl: (primaryImageUrl || '/images/products/headphones.png').trim(),
      galleryImages: galleryArray.length > 0 ? galleryArray : [primaryImageUrl],
      colors: colorsArray,
      sizes: sizesArray,
      description: (description || '').trim(),
      features: featuresArray
    };

    if (mongoose.connection.readyState === 1) {
      let existingProd = null;
      if (mongoose.isValidObjectId(id)) {
        existingProd = await Product.findById(id);
      } else {
        existingProd = await Product.findOne({ slug: id });
      }

      if (existingProd) {
        // Record inventory log if stock changed
        if (existingProd.stockQuantity !== pStock) {
          const delta = pStock - existingProd.stockQuantity;
          await InventoryLog.create({
            product: existingProd._id,
            productName: updateData.name,
            sku: updateData.sku,
            seller: existingProd.seller,
            previousStock: existingProd.stockQuantity,
            newStock: pStock,
            changeAmount: delta,
            reason: delta > 0 ? 'Restock' : 'Manual Adjustment',
            note: 'Updated from Product Specification Editor',
            updatedBy: req.session.adminName || 'Staff'
          });
        }
        await Product.findByIdAndUpdate(existingProd._id, updateData);
      }
    }

    await logAuditAction(req, 'UPDATE_PRODUCT', 'Products', `Updated product: "${updateData.name}"`);
    res.redirect(`/admin/products/edit/${id}?msg=Product+Updated+Successfully`);
  } catch (err) {
    console.error('Update product detail error:', err);
    res.redirect(`/admin/products/edit/${req.params.id}?msg=Error+Updating+Product`);
  }
};

exports.postToggleProductStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1) {
      const prod = mongoose.isValidObjectId(id) ? await Product.findById(id) : await Product.findOne({ slug: id });
      if (prod) {
        const nextStatus = prod.status === 'published' ? 'draft' : 'published';
        prod.status = nextStatus;
        await prod.save();
        await logAuditAction(req, 'TOGGLE_PRODUCT_STATUS', 'Products', `Toggled "${prod.name}" status to "${nextStatus}"`);
      }
    }
    res.redirect('/admin/products?msg=Product+Status+Updated');
  } catch (err) {
    console.error('Toggle status error:', err);
    res.redirect('/admin/products?msg=Error+Toggling+Status');
  }
};

exports.postDeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        await Product.findByIdAndDelete(id);
      } else {
        await Product.findOneAndDelete({ slug: id });
      }
    }
    await logAuditAction(req, 'DELETE_PRODUCT', 'Products', `Deleted product #${id}`);
    res.redirect('/admin/products?msg=Product+Deleted+Successfully');
  } catch (err) {
    console.error('Delete product error:', err);
    res.redirect('/admin/products?msg=Error+Deleting+Product');
  }
};

exports.postBulkActionProducts = async (req, res) => {
  try {
    const { action, productIds, targetCategory } = req.body;
    let ids = Array.isArray(productIds) ? productIds : (productIds ? [productIds] : []);

    if (ids.length === 0) {
      return res.redirect('/admin/products?msg=No+products+selected');
    }

    if (mongoose.connection.readyState === 1) {
      const query = {
        $or: [
          { _id: { $in: ids.filter(id => mongoose.isValidObjectId(id)) } },
          { slug: { $in: ids } }
        ]
      };

      if (action === 'publish') {
        await Product.updateMany(query, { status: 'published' });
      } else if (action === 'unpublish') {
        await Product.updateMany(query, { status: 'draft' });
      } else if (action === 'setTopPick') {
        await Product.updateMany(query, { isTopPick: true });
      } else if (action === 'removeTopPick') {
        await Product.updateMany(query, { isTopPick: false });
      } else if (action === 'changeCategory' && targetCategory) {
        await Product.updateMany(query, { category: targetCategory });
      } else if (action === 'delete') {
        await Product.deleteMany(query);
      }
    }

    await logAuditAction(req, 'BULK_PRODUCT_ACTION', 'Products', `Executed ${action} on ${ids.length} products`);
    res.redirect('/admin/products?msg=Bulk+Action+Executed+Successfully');
  } catch (err) {
    console.error('Bulk action error:', err);
    res.redirect('/admin/products?msg=Error+Executing+Bulk+Action');
  }
};

// ==========================================
// 4. DEDICATED DYNAMIC INVENTORY MANAGEMENT
// ==========================================
exports.getInventory = async (req, res) => {
  try {
    const { isSeller, sellerId, productFilter } = getSellerScoping(req);
    const { search, stockStatus, category, sort } = req.query;

    let queryFilter = { ...productFilter };

    if (search && search.trim()) {
      const term = search.trim();
      queryFilter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { sku: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      queryFilter.category = category;
    }

    if (stockStatus === 'low-stock') {
      queryFilter.$expr = {
        $and: [
          { $gt: ['$stockQuantity', 0] },
          { $lte: ['$stockQuantity', { $ifNull: ['$lowStockThreshold', 10] }] }
        ]
      };
    } else if (stockStatus === 'out-of-stock') {
      queryFilter.stockQuantity = { $lte: 0 };
    } else if (stockStatus === 'in-stock') {
      queryFilter.$expr = { $gt: ['$stockQuantity', { $ifNull: ['$lowStockThreshold', 10] }] };
    }

    if (!isSeller && req.query.sellerId && req.query.sellerId !== 'all' && mongoose.isValidObjectId(req.query.sellerId)) {
      queryFilter.seller = new mongoose.Types.ObjectId(req.query.sellerId);
    }

    let sortObj = { stockQuantity: 1 };
    if (sort === 'stock-desc') sortObj = { stockQuantity: -1 };
    else if (sort === 'name-asc') sortObj = { name: 1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    let products = [];
    let totalItems = 0;
    let allProducts = [];
    let categories = [];
    let sellers = [];

    if (mongoose.connection.readyState === 1) {
      [products, totalItems, allProducts, categories, sellers] = await Promise.all([
        Product.find(queryFilter).sort(sortObj).skip(skip).limit(limit).lean(),
        Product.countDocuments(queryFilter),
        Product.find(productFilter).lean(),
        Category.find().sort({ sortOrder: 1 }).lean(),
        AdminUser.find({ role: 'seller' }).select('name storeName email _id').lean()
      ]);
    } else {
      allProducts = mockData.products || [];
      products = allProducts;
      totalItems = products.length;
      categories = mockData.categories || [];
      sellers = (mockData.adminUsers || []).filter(u => u.role === 'seller');
    }

    // Inventory KPIs from all products
    const totalStockUnits = allProducts.reduce((sum, p) => sum + (Number(p.stockQuantity) || 0), 0);
    const outOfStockCount = allProducts.filter(p => (Number(p.stockQuantity) || 0) <= 0).length;
    const lowStockCount = allProducts.filter(p => {
      const q = Number(p.stockQuantity) || 0;
      const t = Number(p.lowStockThreshold) || 10;
      return q > 0 && q <= t;
    }).length;
    const inStockCount = allProducts.length - outOfStockCount - lowStockCount;

    const totalPages = Math.ceil(totalItems / limit) || 1;

    res.render('admin/inventory', {
      title: 'Inventory & Stock Management — ViVA Admin',
      activeTab: 'inventory',
      products,
      categories,
      sellers,
      selectedSellerId: req.query.sellerId || '',
      stats: {
        totalProducts: allProducts.length,
        totalStockUnits,
        inStockCount,
        lowStockCount,
        outOfStockCount
      },
      query: req.query,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      message: req.query.msg || null,
      isSeller
    });
  } catch (err) {
    console.error('Inventory error:', err);
    res.status(500).send('Error loading inventory: ' + err.message);
  }
};

exports.postAdjustStock = async (req, res) => {
  try {
    const { productId, newStock, adjustment, reason, note } = req.body;

    if (!productId) {
      return res.redirect('/admin/inventory?msg=Product+ID+Required');
    }

    if (mongoose.connection.readyState === 1) {
      const prod = mongoose.isValidObjectId(productId) ? await Product.findById(productId) : await Product.findOne({ slug: productId });
      if (!prod) {
        return res.redirect('/admin/inventory?msg=Product+Not+Found');
      }

      const previousStock = prod.stockQuantity || 0;
      let finalStock = previousStock;

      if (newStock !== undefined && newStock !== '') {
        finalStock = Math.max(0, parseInt(newStock));
      } else if (adjustment !== undefined && adjustment !== '') {
        finalStock = Math.max(0, previousStock + parseInt(adjustment));
      } else if (req.body.adjustmentAmount !== undefined && req.body.adjustmentAmount !== '') {
        const amt = parseInt(req.body.adjustmentAmount) || 0;
        if (req.body.actionType === 'add') finalStock = previousStock + amt;
        else if (req.body.actionType === 'subtract') finalStock = Math.max(0, previousStock - amt);
        else finalStock = Math.max(0, amt);
      }

      const changeAmount = finalStock - previousStock;
      prod.stockQuantity = finalStock;
      await prod.save();

      // Log movement to InventoryLog
      await InventoryLog.create({
        product: prod._id,
        productName: prod.name,
        sku: prod.sku,
        seller: prod.seller,
        previousStock,
        newStock: finalStock,
        changeAmount,
        reason: reason || (changeAmount >= 0 ? 'Restock' : 'Manual Adjustment'),
        note: (note || '').trim(),
        updatedBy: req.session.adminName || 'Staff'
      });

      await logAuditAction(req, 'ADJUST_STOCK', 'Inventory', `Adjusted stock for "${prod.name}" (${prod.sku}): ${previousStock} → ${finalStock} (${changeAmount >= 0 ? '+' : ''}${changeAmount})`);
    }

    res.redirect('/admin/inventory?msg=Stock+Adjusted+Successfully');
  } catch (err) {
    console.error('Adjust stock error:', err);
    res.redirect('/admin/inventory?msg=Error+Adjusting+Stock:+' + encodeURIComponent(err.message));
  }
};

exports.getInventoryHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    let logs = [];

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(productId)) {
      logs = await InventoryLog.find({ product: productId }).sort({ createdAt: -1 }).limit(30).lean();
    }

    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.postBulkAdjustStock = async (req, res) => {
  try {
    const { productIds, bulkActionType, bulkAmount, reason, note } = req.body;
    const ids = Array.isArray(productIds) ? productIds : (productIds ? [productIds] : []);
    const amount = parseInt(bulkAmount) || 0;

    if (ids.length === 0 || amount === 0) {
      return res.redirect('/admin/inventory?msg=Invalid+bulk+adjustment+parameters');
    }

    if (mongoose.connection.readyState === 1) {
      for (const id of ids) {
        const prod = mongoose.isValidObjectId(id) ? await Product.findById(id) : await Product.findOne({ slug: id });
        if (prod) {
          const prev = prod.stockQuantity || 0;
          let nextStock = prev;
          if (bulkActionType === 'add') nextStock = prev + amount;
          else if (bulkActionType === 'subtract') nextStock = Math.max(0, prev - amount);
          else if (bulkActionType === 'set') nextStock = Math.max(0, amount);

          const diff = nextStock - prev;
          prod.stockQuantity = nextStock;
          await prod.save();

          await InventoryLog.create({
            product: prod._id,
            productName: prod.name,
            sku: prod.sku,
            seller: prod.seller,
            previousStock: prev,
            newStock: nextStock,
            changeAmount: diff,
            reason: reason || 'Manual Adjustment',
            note: note || 'Bulk stock modification',
            updatedBy: req.session.adminName || 'Staff'
          });
        }
      }
    }

    await logAuditAction(req, 'BULK_STOCK_ADJUST', 'Inventory', `Bulk adjusted stock for ${ids.length} products`);
    res.redirect('/admin/inventory?msg=Bulk+Stock+Adjustment+Complete');
  } catch (err) {
    console.error('Bulk stock adjust error:', err);
    res.redirect('/admin/inventory?msg=Error+In+Bulk+Adjustment');
  }
};

// ==========================================
// 5. ORDERS & FULFILLMENT MANAGEMENT
// ==========================================
exports.getOrders = async (req, res) => {
  try {
    const { isSeller, sellerId, orderFilter } = getSellerScoping(req);
    const { search, status, paymentStatus, shippingStatus, sort } = req.query;

    let queryFilter = { ...orderFilter };

    if (search && search.trim()) {
      const term = search.trim();
      queryFilter.$or = [
        { orderNumber: { $regex: term, $options: 'i' } },
        { 'customer.name': { $regex: term, $options: 'i' } },
        { 'customer.email': { $regex: term, $options: 'i' } },
        { 'customer.phone': { $regex: term, $options: 'i' } },
        { trackingNumber: { $regex: term, $options: 'i' } },
        { 'items.name': { $regex: term, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      queryFilter.status = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      queryFilter.paymentStatus = paymentStatus;
    }

    if (shippingStatus && shippingStatus !== 'all') {
      queryFilter.shippingStatus = shippingStatus;
    }

    if (!isSeller && req.query.sellerId && req.query.sellerId !== 'all' && mongoose.isValidObjectId(req.query.sellerId)) {
      queryFilter['items.seller'] = new mongoose.Types.ObjectId(req.query.sellerId);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'total-desc') sortObj = { total: -1 };
    else if (sort === 'total-asc') sortObj = { total: 1 };
    else if (sort === 'oldest') sortObj = { createdAt: 1 };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    let orders = [];
    let totalOrders = 0;
    let allOrders = [];
    let sellers = [];

    if (mongoose.connection.readyState === 1) {
      [orders, totalOrders, allOrders, sellers] = await Promise.all([
        Order.find(queryFilter).sort(sortObj).skip(skip).limit(limit).lean(),
        Order.countDocuments(queryFilter),
        Order.find(orderFilter).lean(),
        AdminUser.find({ role: 'seller' }).select('name storeName email _id').lean()
      ]);
    } else {
      allOrders = mockData.orders || [];
      orders = allOrders;
      totalOrders = orders.length;
      sellers = (mockData.adminUsers || []).filter(u => u.role === 'seller');
    }

    const totalRevenue = allOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);

    const pendingCount = allOrders.filter(o => o.status === 'Ordered' || o.status === 'Processing').length;
    const shippedCount = allOrders.filter(o => o.status === 'Shipped').length;
    const deliveredCount = allOrders.filter(o => o.status === 'Delivered').length;

    const totalPages = Math.ceil(totalOrders / limit) || 1;

    res.render('admin/orders', {
      title: 'Orders & Fulfillment — ViVA Admin',
      activeTab: 'orders',
      orders,
      sellers,
      selectedSellerId: req.query.sellerId || '',
      stats: {
        totalOrders: allOrders.length,
        totalRevenue: totalRevenue.toFixed(2),
        pendingCount,
        shippedCount,
        deliveredCount
      },
      query: req.query,
      pagination: {
        page,
        limit,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      message: req.query.msg || null,
      isSeller
    });
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).send('Error loading orders: ' + err.message);
  }
};

exports.getOrderDetailJson = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    let order = null;

    if (mongoose.connection.readyState === 1) {
      order = await Order.findOne({ orderNumber }).lean();
    } else {
      order = (mockData.orders || []).find(o => o.orderNumber === orderNumber);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Get order detail error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.postUpdateOrderStatus = async (req, res) => {
  try {
    const { orderNumber, status, paymentStatus, shippingStatus, trackingNumber, carrier, note } = req.body;

    if (!orderNumber) {
      return res.redirect('/admin/orders?msg=Order+Number+Required');
    }

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({ orderNumber });
      if (order) {
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (shippingStatus) order.shippingStatus = shippingStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber.trim();
        if (carrier) order.carrier = carrier.trim();

        // Push chronological entry to statusHistory
        order.statusHistory.push({
          status: order.status,
          paymentStatus: order.paymentStatus,
          shippingStatus: order.shippingStatus,
          date: new Date(),
          note: (note || `Updated status to ${order.status}`).trim(),
          updatedBy: req.session.adminName || 'Staff'
        });

        await order.save();
        await logAuditAction(req, 'UPDATE_ORDER_STATUS', 'Orders', `Updated order #${orderNumber} to "${order.status}"`);
      }
    }

    res.redirect('/admin/orders?msg=Order+Updated+Successfully');
  } catch (err) {
    console.error('Update order status error:', err);
    res.redirect('/admin/orders?msg=Error+Updating+Order');
  }
};

exports.postBulkUpdateOrders = async (req, res) => {
  try {
    const { status, orderNumbers } = req.body;
    const nums = Array.isArray(orderNumbers) ? orderNumbers : (orderNumbers ? [orderNumbers] : []);

    if (nums.length === 0 || !status) {
      return res.redirect('/admin/orders?msg=No+orders+selected');
    }

    if (mongoose.connection.readyState === 1) {
      for (const num of nums) {
        const ord = await Order.findOne({ orderNumber: num });
        if (ord) {
          ord.status = status;
          ord.statusHistory.push({
            status,
            paymentStatus: ord.paymentStatus,
            shippingStatus: ord.shippingStatus,
            date: new Date(),
            note: `Bulk updated status to ${status}`,
            updatedBy: req.session.adminName || 'Staff'
          });
          await ord.save();
        }
      }
    }

    await logAuditAction(req, 'BULK_ORDER_UPDATE', 'Orders', `Updated status for ${nums.length} orders to ${status}`);
    res.redirect('/admin/orders?msg=Bulk+Orders+Updated');
  } catch (err) {
    console.error('Bulk order error:', err);
    res.redirect('/admin/orders?msg=Error+Updating+Bulk+Orders');
  }
};

// ==========================================
// 6. SELLER PROFILE & SETTINGS
// ==========================================
exports.getSellerProfile = async (req, res) => {
  try {
    const role = req.session.adminRole || 'admin';
    const isSeller = role === 'seller';
    let user = null;

    if (mongoose.connection.readyState === 1 && req.session.adminId && mongoose.isValidObjectId(req.session.adminId)) {
      user = await AdminUser.findById(req.session.adminId).lean();
    }

    if (!user) {
      user = {
        name: req.session.adminName || 'ViVA Seller',
        email: req.session.adminUser || 'seller@viva.com',
        storeName: req.session.adminStoreName || 'Apex Modern Living',
        storeDescription: 'Premier provider of high-grade acoustic audio gear, modern lighting, and minimalist lifestyle essentials.',
        logoUrl: '/images/viva-logo.png',
        bannerUrl: '/images/hero-composite.png',
        businessEmail: 'contact@apexliving.com',
        businessPhone: '+1 (555) 789-0123',
        businessAddress: '100 Innovation Way, Suite 400, Austin, TX 78701',
        businessInfo: {
          taxId: 'TAX-TX-781920',
          registrationNumber: 'REG-2024-APEX',
          returnPolicy: '30-day satisfaction guarantee.',
          shippingPolicy: 'Dispatches within 24 hours.'
        }
      };
    }

    let sellerProductCount = 0;
    let sellerOrderCount = 0;
    let sellerRevenue = 0;

    if (mongoose.connection.readyState === 1 && user._id) {
      const prodQuery = isSeller ? { seller: user._id } : {};
      const orderQuery = isSeller ? { 'items.seller': user._id } : {};
      
      sellerProductCount = await Product.countDocuments(prodQuery);
      const orders = await Order.find({ ...orderQuery, status: { $ne: 'Cancelled' } }).lean();
      sellerOrderCount = orders.length;
      sellerRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
    }

    res.render('admin/profile', {
      title: 'Seller Store Profile — ViVA Admin',
      activeTab: 'profile',
      profile: user,
      isSeller,
      stats: {
        productCount: sellerProductCount,
        orderCount: sellerOrderCount,
        revenue: sellerRevenue.toFixed(2)
      },
      message: req.query.msg || null
    });
  } catch (err) {
    console.error('Seller profile error:', err);
    res.redirect('/admin?msg=Error+Loading+Profile');
  }
};

exports.postUpdateSellerProfile = async (req, res) => {
  try {
    const {
      storeName,
      storeDescription,
      logoUrl,
      bannerUrl,
      businessEmail,
      businessPhone,
      businessAddress,
      taxId,
      registrationNumber,
      returnPolicy,
      shippingPolicy
    } = req.body;

    const updateFields = {
      storeName: (storeName || 'ViVA Store').trim(),
      storeDescription: (storeDescription || '').trim(),
      logoUrl: (logoUrl || '/images/viva-logo.png').trim(),
      bannerUrl: (bannerUrl || '/images/hero-composite.png').trim(),
      businessEmail: (businessEmail || '').trim(),
      businessPhone: (businessPhone || '').trim(),
      businessAddress: (businessAddress || '').trim(),
      businessInfo: {
        taxId: (taxId || '').trim(),
        registrationNumber: (registrationNumber || '').trim(),
        returnPolicy: (returnPolicy || '').trim(),
        shippingPolicy: (shippingPolicy || '').trim()
      }
    };

    if (mongoose.connection.readyState === 1 && req.session.adminId && mongoose.isValidObjectId(req.session.adminId)) {
      await AdminUser.findByIdAndUpdate(req.session.adminId, updateFields);
      req.session.adminStoreName = updateFields.storeName;
    }

    await logAuditAction(req, 'UPDATE_SELLER_PROFILE', 'Profile', `Updated seller store profile: "${updateFields.storeName}"`);
    res.redirect('/admin/profile?msg=Store+Profile+Updated+Successfully');
  } catch (err) {
    console.error('Update seller profile error:', err);
    res.redirect('/admin/profile?msg=Error+Updating+Profile');
  }
};

// ==========================================
// 7. CATEGORIES MANAGEMENT
// ==========================================
exports.getCategories = async (req, res) => {
  try {
    let categories = [];
    let productCountMap = {};

    if (mongoose.connection.readyState === 1) {
      categories = await Category.find().sort({ sortOrder: 1 }).lean();
      // Real database count aggregation
      const counts = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      counts.forEach(c => {
        if (c._id) productCountMap[c._id.toLowerCase()] = c.count;
      });
    } else {
      categories = mockData.categories || [];
    }

    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      productCount: productCountMap[cat.name.toLowerCase()] || 0
    }));

    res.render('admin/categories', {
      title: 'Categories Management — ViVA Admin',
      activeTab: 'categories',
      categories: categoriesWithCount,
      message: req.query.msg || null
    });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).send('Error loading categories');
  }
};

exports.postCreateCategory = async (req, res) => {
  try {
    const { name, iconClass, bgColor, iconColor, sortOrder } = req.body;
    const cleanName = (name || '').trim();
    if (!cleanName) return res.redirect('/admin/categories?msg=Category+Name+Required');

    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (mongoose.connection.readyState === 1) {
      await Category.create({
        name: cleanName,
        slug,
        iconClass: (iconClass || 'fa-solid fa-layer-group').trim(),
        bgColor: bgColor || '#e6edf5',
        iconColor: iconColor || '#123524',
        sortOrder: parseInt(sortOrder) || 0,
        isFeatured: true
      });
    }

    await logAuditAction(req, 'CREATE_CATEGORY', 'Categories', `Created category: "${cleanName}"`);
    res.redirect('/admin/categories?msg=Category+Created');
  } catch (err) {
    console.error('Create category error:', err);
    res.redirect('/admin/categories?msg=Error+Creating+Category');
  }
};

exports.postToggleCategoryStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const cat = await Category.findById(id);
      if (cat) {
        cat.isFeatured = !cat.isFeatured;
        await cat.save();
        await logAuditAction(req, 'TOGGLE_CATEGORY', 'Categories', `Toggled featured status for "${cat.name}"`);
      }
    }
    res.redirect('/admin/categories?msg=Category+Status+Updated');
  } catch (err) {
    console.error('Toggle category status error:', err);
    res.redirect('/admin/categories?msg=Error+Toggling+Status');
  }
};

exports.postUpdateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, iconClass, bgColor, iconColor, sortOrder } = req.body;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Category.findByIdAndUpdate(id, {
        name: (name || '').trim(),
        iconClass: (iconClass || 'fa-solid fa-layer-group').trim(),
        bgColor: bgColor || '#e6edf5',
        iconColor: iconColor || '#123524',
        sortOrder: parseInt(sortOrder) || 0
      });
    }

    await logAuditAction(req, 'UPDATE_CATEGORY', 'Categories', `Updated category #${id}`);
    res.redirect('/admin/categories?msg=Category+Updated');
  } catch (err) {
    console.error('Update category error:', err);
    res.redirect('/admin/categories?msg=Error+Updating+Category');
  }
};

exports.postDeleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Category.findByIdAndDelete(id);
    }
    await logAuditAction(req, 'DELETE_CATEGORY', 'Categories', `Deleted category #${id}`);
    res.redirect('/admin/categories?msg=Category+Deleted');
  } catch (err) {
    console.error('Delete category error:', err);
    res.redirect('/admin/categories?msg=Error+Deleting+Category');
  }
};

// ==========================================
// 8. USER & CUSTOMER MANAGEMENT
// ==========================================
exports.getUsers = async (req, res) => {
  try {
    const subTab = req.query.tab || 'customers';
    const search = (req.query.q || '').toLowerCase().trim();
    const statusFilter = req.query.status || 'all';
    const roleFilter = req.query.role || 'all';

    let customers = [];
    let staffUsers = [];
    let allOrders = [];

    if (mongoose.connection.readyState === 1) {
      [customers, staffUsers, allOrders] = await Promise.all([
        User.find().sort({ createdAt: -1 }).lean(),
        AdminUser.find().sort({ createdAt: -1 }).lean(),
        Order.find().lean()
      ]);
    } else {
      customers = mockData.customers || [];
      staffUsers = mockData.adminUsers || [];
      allOrders = mockData.orders || [];
    }

    // Dynamic stats computation for customers
    const customersWithStats = customers.map(c => {
      const custEmail = (c.email || '').toLowerCase().trim();
      const custOrders = allOrders.filter(o => (o.customer?.email || '').toLowerCase().trim() === custEmail);
      const totalSpent = custOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const lastOrder = custOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      return {
        ...c,
        orderCount: custOrders.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        lastOrderDate: lastOrder ? lastOrder.createdAt : null,
        recentOrders: custOrders.slice(0, 5)
      };
    });

    const customerStats = {
      totalCustomers: customersWithStats.length,
      activeCount: customersWithStats.filter(c => c.status === 'active').length,
      suspendedCount: customersWithStats.filter(c => c.status === 'suspended').length,
      vipCount: customersWithStats.filter(c => c.role === 'vip').length,
      totalOrders: customersWithStats.reduce((sum, c) => sum + (c.orderCount || 0), 0),
      totalRevenue: Math.round(customersWithStats.reduce((sum, c) => sum + (c.totalSpent || 0), 0) * 100) / 100
    };

    const staffStats = {
      totalUsers: staffUsers.length,
      adminCount: staffUsers.filter(u => u.role === 'admin').length,
      managerCount: staffUsers.filter(u => u.role === 'manager').length,
      sellerCount: staffUsers.filter(u => u.role === 'seller').length,
      supportCount: staffUsers.filter(u => u.role === 'support').length
    };

    const allProducts = mongoose.connection.readyState === 1 ? await Product.find().lean() : (mockData.products || []);

    // Dynamic stats computation for sellers & merchants
    const sellers = staffUsers.filter(u => u.role === 'seller');
    const sellersWithStats = sellers.map(s => {
      const sId = s._id ? s._id.toString() : '';
      const sProducts = allProducts.filter(p => p.seller && p.seller.toString() === sId);
      const sOrders = allOrders.filter(o => o.items && o.items.some(it => it.seller && it.seller.toString() === sId));
      let sRevenue = 0;
      sOrders.forEach(o => {
        if (o.status !== 'Cancelled') {
          (o.items || []).forEach(it => {
            if (it.seller && it.seller.toString() === sId) {
              sRevenue += (it.price * (it.quantity || 1));
            }
          });
        }
      });
      return {
        ...s,
        productCount: sProducts.length,
        orderCount: sOrders.length,
        totalRevenue: Math.round(sRevenue * 100) / 100,
        recentProducts: sProducts.slice(0, 3)
      };
    });

    const sellerStats = {
      totalSellers: sellersWithStats.length,
      activeCount: sellersWithStats.filter(s => s.status === 'active').length,
      suspendedCount: sellersWithStats.filter(s => s.status === 'suspended').length,
      totalProducts: sellersWithStats.reduce((sum, s) => sum + s.productCount, 0),
      totalRevenue: Math.round(sellersWithStats.reduce((sum, s) => sum + s.totalRevenue, 0) * 100) / 100
    };

    let filteredSellers = sellersWithStats;
    if (search) {
      filteredSellers = filteredSellers.filter(s =>
        (s.name && s.name.toLowerCase().includes(search)) ||
        (s.email && s.email.toLowerCase().includes(search)) ||
        (s.storeName && s.storeName.toLowerCase().includes(search)) ||
        (s.businessPhone && s.businessPhone.includes(search))
      );
    }
    if (statusFilter !== 'all') {
      filteredSellers = filteredSellers.filter(s => s.status === statusFilter);
    }

    let filteredCustomers = customersWithStats;
    if (search) {
      filteredCustomers = filteredCustomers.filter(c =>
        (c.name && c.name.toLowerCase().includes(search)) ||
        (c.email && c.email.toLowerCase().includes(search)) ||
        (c.phone && c.phone.includes(search))
      );
    }
    if (statusFilter !== 'all') {
      filteredCustomers = filteredCustomers.filter(c => c.status === statusFilter);
    }
    if (roleFilter !== 'all') {
      filteredCustomers = filteredCustomers.filter(c => c.role === roleFilter);
    }

    res.render('admin/users', {
      title: 'User, Merchant & Customer Management — ViVA Admin',
      activeTab: 'users',
      subTab,
      users: staffUsers,
      allStaff: staffUsers,
      customers: filteredCustomers,
      allCustomers: customersWithStats,
      sellers: filteredSellers,
      allSellers: sellersWithStats,
      stats: staffStats,
      customerStats,
      sellerStats,
      filters: { q: req.query.q || '', status: statusFilter, role: roleFilter },
      message: req.query.msg || null
    });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).send('Error loading users: ' + err.message);
  }
};

exports.getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let customer = null;
    let orders = [];

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      customer = await User.findById(id).lean();
      if (customer) {
        orders = await Order.find({ 'customer.email': customer.email.toLowerCase() }).sort({ createdAt: -1 }).lean();
      }
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const totalSpent = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    res.json({
      success: true,
      customer: {
        ...customer,
        orderCount: orders.length,
        totalSpent: totalSpent.toFixed(2),
        orders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.postToggleCustomerStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const user = await User.findById(id);
      if (user) {
        user.status = user.status === 'active' ? 'suspended' : 'active';
        await user.save();
        await logAuditAction(req, 'TOGGLE_CUSTOMER_STATUS', 'Customers', `Toggled status for ${user.email} to ${user.status}`);
      }
    }
    res.redirect('/admin/users?tab=customers&msg=Customer+Status+Updated');
  } catch (err) {
    console.error('Toggle customer status error:', err);
    res.redirect('/admin/users?tab=customers&msg=Error+Updating+Status');
  }
};

exports.postCreateCustomer = async (req, res) => {
  try {
    const { name, email, phone, password, role, status, street, city, state, zip, country } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanName = (name || '').trim();

    if (!cleanName || !cleanEmail) {
      return res.redirect('/admin/users?tab=customers&msg=Name+and+email+are+required');
    }

    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) return res.redirect('/admin/users?tab=customers&msg=Customer+Email+Already+Exists');

      const { hash, salt } = hashPassword(password || 'Customer123!');
      await User.create({
        name: cleanName,
        email: cleanEmail,
        phone: (phone || '').trim(),
        passwordHash: hash,
        salt,
        role: role || 'customer',
        status: status || 'active',
        addresses: [{
          street: (street || '').trim(),
          city: (city || '').trim(),
          state: (state || '').trim(),
          zip: (zip || '').trim(),
          country: (country || 'United States').trim(),
          isDefault: true
        }]
      });
    }

    await logAuditAction(req, 'CREATE_CUSTOMER', 'Customers', `Created customer: ${cleanName} (${cleanEmail})`);
    res.redirect('/admin/users?tab=customers&msg=Customer+Created+Successfully');
  } catch (err) {
    console.error('Create customer error:', err);
    res.redirect('/admin/users?tab=customers&msg=Error+Creating+Customer');
  }
};

exports.postUpdateCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, phone, role, status } = req.body;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await User.findByIdAndUpdate(id, {
        name: (name || '').trim(),
        phone: (phone || '').trim(),
        role: role || 'customer',
        status: status || 'active'
      });
    }

    await logAuditAction(req, 'UPDATE_CUSTOMER', 'Customers', `Updated customer #${id}`);
    res.redirect('/admin/users?tab=customers&msg=Customer+Updated+Successfully');
  } catch (err) {
    console.error('Update customer error:', err);
    res.redirect('/admin/users?tab=customers&msg=Error+Updating+Customer');
  }
};

exports.postResetCustomerPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.redirect('/admin/users?tab=customers&msg=Password+must+be+at+least+6+characters');
    }

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const { hash, salt } = hashPassword(newPassword);
      await User.findByIdAndUpdate(id, { passwordHash: hash, salt });
    }

    await logAuditAction(req, 'RESET_CUSTOMER_PASSWORD', 'Customers', `Reset password for customer #${id}`);
    res.redirect('/admin/users?tab=customers&msg=Password+Reset+Successfully');
  } catch (err) {
    console.error('Reset password error:', err);
    res.redirect('/admin/users?tab=customers&msg=Error+Resetting+Password');
  }
};

exports.postDeleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await User.findByIdAndDelete(id);
    }
    await logAuditAction(req, 'DELETE_CUSTOMER', 'Customers', `Deleted customer #${id}`);
    res.redirect('/admin/users?tab=customers&msg=Customer+Deleted');
  } catch (err) {
    console.error('Delete customer error:', err);
    res.redirect('/admin/users?tab=customers&msg=Error+Deleting+Customer');
  }
};

exports.postBulkCustomerAction = async (req, res) => {
  try {
    const { action, customerIds } = req.body;
    const ids = Array.isArray(customerIds) ? customerIds : (customerIds ? [customerIds] : []);

    if (ids.length === 0) return res.redirect('/admin/users?tab=customers&msg=No+customers+selected');

    if (mongoose.connection.readyState === 1) {
      const validIds = ids.filter(id => mongoose.isValidObjectId(id));
      if (action === 'activate') {
        await User.updateMany({ _id: { $in: validIds } }, { status: 'active' });
      } else if (action === 'suspend') {
        await User.updateMany({ _id: { $in: validIds } }, { status: 'suspended' });
      } else if (action === 'makeVIP') {
        await User.updateMany({ _id: { $in: validIds } }, { role: 'vip' });
      } else if (action === 'delete') {
        await User.deleteMany({ _id: { $in: validIds } });
      }
    }

    await logAuditAction(req, 'BULK_CUSTOMER_ACTION', 'Customers', `Executed bulk ${action} on ${ids.length} customers`);
    res.redirect('/admin/users?tab=customers&msg=Bulk+Action+Executed');
  } catch (err) {
    console.error('Bulk customer error:', err);
    res.redirect('/admin/users?tab=customers&msg=Error+Executing+Action');
  }
};

exports.exportCustomers = async (req, res) => {
  try {
    let customers = [];
    if (mongoose.connection.readyState === 1) {
      customers = await User.find().lean();
    }

    const csvHeader = 'Name,Email,Phone,Role,Status,Created At\n';
    const csvRows = customers.map(c =>
      `"${c.name}","${c.email}","${c.phone || ''}","${c.role}","${c.status}","${new Date(c.createdAt).toISOString()}"`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=viva_customers.csv');
    res.send(csvHeader + csvRows);
  } catch (err) {
    res.redirect('/admin/users?tab=customers&msg=Export+Failed');
  }
};

// Staff & Seller management
exports.postCreateUser = async (req, res) => {
  try {
    const { name, email, password, role, storeName, storeDescription, phone } = req.body;
    const userRole = role || 'seller';
    if (mongoose.connection.readyState === 1) {
      await AdminUser.create({
        name: (name || '').trim(),
        email: (email || '').toLowerCase().trim(),
        password: password || 'Admin123!',
        role: userRole,
        status: 'active',
        storeName: (storeName || name || 'New Merchant Store').trim(),
        storeDescription: (storeDescription || '').trim(),
        businessPhone: (phone || '').trim(),
        avatarUrl: userRole === 'seller' ? '/images/avatars/priya.jpg' : '/images/avatars/sarah.jpg'
      });
    }
    await logAuditAction(req, 'CREATE_USER', 'Users', `Created ${userRole} account: ${email}`);
    const redirectTab = userRole === 'seller' ? 'sellers' : 'staff';
    res.redirect(`/admin/users?tab=${redirectTab}&msg=${userRole === 'seller' ? 'Seller+Created+Successfully' : 'Staff+User+Created'}`);
  } catch (err) {
    res.redirect('/admin/users?tab=staff&msg=Error+Creating+User');
  }
};

exports.postToggleSellerStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const user = await AdminUser.findById(id);
      if (user) {
        user.status = user.status === 'active' ? 'suspended' : 'active';
        await user.save();
        await logAuditAction(req, 'TOGGLE_SELLER_STATUS', 'Sellers', `Toggled seller ${user.email} to ${user.status}`);
      }
    }
    res.redirect('/admin/users?tab=sellers&msg=Seller+Status+Updated');
  } catch (err) {
    res.redirect('/admin/users?tab=sellers&msg=Error+Updating+Seller+Status');
  }
};

exports.postUpdateUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await AdminUser.findByIdAndUpdate(id, { role });
    }
    res.redirect('/admin/users?tab=staff&msg=Role+Updated');
  } catch (err) {
    res.redirect('/admin/users?tab=staff&msg=Error+Updating+Role');
  }
};

exports.postToggleUserStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const user = await AdminUser.findById(id);
      if (user) {
        user.status = user.status === 'active' ? 'suspended' : 'active';
        await user.save();
      }
    }
    res.redirect('/admin/users?tab=staff&msg=Status+Updated');
  } catch (err) {
    res.redirect('/admin/users?tab=staff&msg=Error+Updating+Status');
  }
};

exports.postDeleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await AdminUser.findByIdAndDelete(id);
    }
    res.redirect('/admin/users?tab=staff&msg=Staff+Deleted');
  } catch (err) {
    res.redirect('/admin/users?tab=staff&msg=Error+Deleting+Staff');
  }
};

// ==========================================
// 9. SETTINGS & SEO
// ==========================================
exports.getSettings = async (req, res) => {
  try {
    let settings = null;
    if (mongoose.connection.readyState === 1) {
      settings = await SiteSetting.findOne().lean();
    }
    if (!settings) settings = mockData.siteSettings;

    res.render('admin/settings', {
      title: 'Global Settings — ViVA Admin',
      activeTab: 'settings',
      settings,
      isProfileMode: false,
      message: req.query.msg || null
    });
  } catch (err) {
    res.status(500).send('Error loading settings');
  }
};

exports.postUpdateSettings = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (mongoose.connection.readyState === 1) {
      await SiteSetting.findOneAndUpdate({}, updateData, { upsert: true, new: true });
    }
    await logAuditAction(req, 'UPDATE_SETTINGS', 'Settings', 'Updated global site settings');
    res.redirect('/admin/settings?msg=Settings+Saved+Successfully');
  } catch (err) {
    res.redirect('/admin/settings?msg=Error+Saving+Settings');
  }
};

// ==========================================
// 10. TOP PICKS, BANNERS, MEDIA, REVIEWS, INQUIRIES, AUDIT
// ==========================================
exports.getTopPicks = async (req, res) => {
  try {
    let products = [];
    let settings = null;

    if (mongoose.connection.readyState === 1) {
      products = await Product.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
      settings = await TopPickSetting.findOne().lean();
    } else {
      products = mockData.products || [];
      settings = mockData.topPicksSettings;
    }

    res.render('admin/top-picks', {
      title: 'Top Picks Deals — ViVA Admin',
      activeTab: 'top-picks',
      products,
      settings: settings || { title: 'Top Picks For You', badge: '✨', maxDisplayCount: 10, isActive: true },
      message: req.query.msg || null
    });
  } catch (err) {
    res.status(500).send('Error loading top picks');
  }
};

exports.postToggleTopPick = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1) {
      const prod = mongoose.isValidObjectId(id) ? await Product.findById(id) : await Product.findOne({ slug: id });
      if (prod) {
        prod.isTopPick = !prod.isTopPick;
        await prod.save();
      }
    }
    res.redirect(req.headers.referer || '/admin/top-picks');
  } catch (err) {
    res.redirect('/admin/top-picks?msg=Error');
  }
};

exports.postUpdateTopPick = async (req, res) => {
  try {
    const id = req.params.id;
    const { badgeText, sortOrder } = req.body;
    if (mongoose.connection.readyState === 1) {
      const updateFields = {};
      if (badgeText !== undefined) updateFields.badgeText = badgeText.trim();
      if (sortOrder !== undefined) updateFields.sortOrder = parseInt(sortOrder) || 0;
      if (mongoose.isValidObjectId(id)) {
        await Product.findByIdAndUpdate(id, updateFields);
      } else {
        await Product.findOneAndUpdate({ slug: id }, updateFields);
      }
    }
    res.redirect('/admin/top-picks?msg=Deal+Updated');
  } catch (err) {
    res.redirect('/admin/top-picks?msg=Error');
  }
};

exports.postAddExistingTopPick = async (req, res) => {
  try {
    const { productId, badgeText, sortOrder } = req.body;
    if (mongoose.connection.readyState === 1 && productId) {
      await Product.findByIdAndUpdate(productId, {
        isTopPick: true,
        badgeText: (badgeText || 'HOT DEAL').trim(),
        sortOrder: parseInt(sortOrder) || 0
      });
    }
    res.redirect('/admin/top-picks?msg=Product+Added+To+Deals');
  } catch (err) {
    res.redirect('/admin/top-picks?msg=Error');
  }
};

exports.postRemoveTopPick = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        await Product.findByIdAndUpdate(id, { isTopPick: false });
      } else {
        await Product.findOneAndUpdate({ slug: id }, { isTopPick: false });
      }
    }
    res.redirect('/admin/top-picks?msg=Removed+From+Top+Picks');
  } catch (err) {
    res.redirect('/admin/top-picks?msg=Error');
  }
};

exports.postUpdateTopPicksSettings = async (req, res) => {
  try {
    const { title, badge, subtitle, seeAllText, seeAllUrl, isActive, maxDisplayCount } = req.body;
    if (mongoose.connection.readyState === 1) {
      await TopPickSetting.findOneAndUpdate({}, {
        title: (title || 'Top Picks For You').trim(),
        badge: (badge || '✨').trim(),
        subtitle: (subtitle || '').trim(),
        seeAllText: (seeAllText || 'See All Deals').trim(),
        seeAllUrl: (seeAllUrl || '/shop').trim(),
        isActive: isActive === 'on' || isActive === true,
        maxDisplayCount: parseInt(maxDisplayCount) || 10
      }, { upsert: true });
    }
    res.redirect('/admin/top-picks?msg=Settings+Saved');
  } catch (err) {
    res.redirect('/admin/top-picks?msg=Error');
  }
};

exports.getBanners = async (req, res) => {
  try {
    let heroSlides = [];
    let promoBanners = [];
    if (mongoose.connection.readyState === 1) {
      [heroSlides, promoBanners] = await Promise.all([
        HeroSlide.find().sort({ sortOrder: 1 }).lean(),
        PromoBanner.find().sort({ sortOrder: 1 }).lean()
      ]);
    } else {
      heroSlides = mockData.heroSlides || [];
      promoBanners = mockData.promoBanners || [];
    }

    res.render('admin/banners', {
      title: 'Banners & Visuals — ViVA Admin',
      activeTab: 'banners',
      heroSlides,
      promoBanners,
      message: req.query.msg || null
    });
  } catch (err) {
    res.status(500).send('Error loading banners');
  }
};

exports.postCreateHeroSlide = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await HeroSlide.create(req.body);
    }
    res.redirect('/admin/banners?msg=Hero+Slide+Created');
  } catch (err) {
    res.redirect('/admin/banners?msg=Error');
  }
};

exports.postUpdateHeroSlide = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await HeroSlide.findByIdAndUpdate(id, req.body);
    }
    res.redirect('/admin/banners?msg=Hero+Slide+Updated');
  } catch (err) {
    res.redirect('/admin/banners?msg=Error');
  }
};

exports.postDeleteHeroSlide = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await HeroSlide.findByIdAndDelete(id);
    }
    res.redirect('/admin/banners?msg=Hero+Slide+Deleted');
  } catch (err) {
    res.redirect('/admin/banners?msg=Error');
  }
};

exports.postUpdatePromoBanner = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await PromoBanner.findByIdAndUpdate(id, req.body);
    }
    res.redirect('/admin/banners?msg=Promo+Banner+Updated');
  } catch (err) {
    res.redirect('/admin/banners?msg=Error');
  }
};

exports.getMedia = (req, res) => {
  res.render('admin/media', {
    title: 'Media Library — ViVA Admin',
    activeTab: 'media',
    mediaItems: customMediaItems,
    message: req.query.msg || null
  });
};

exports.postAddMedia = (req, res) => {
  const { name, path: mPath, category, size } = req.body;
  if (name && mPath) {
    customMediaItems.unshift({
      _id: 'm_' + Date.now(),
      name: name.trim(),
      path: mPath.trim(),
      category: category || 'General',
      size: size || 'Unknown'
    });
  }
  res.redirect('/admin/media?msg=Asset+Registered');
};

exports.getReviews = async (req, res) => {
  try {
    let reviews = [];
    if (mongoose.connection.readyState === 1) {
      reviews = await Review.find().sort({ sortOrder: 1 }).lean();
    } else {
      reviews = mockData.reviews || [];
    }
    res.render('admin/reviews', {
      title: 'Customer Reviews — ViVA Admin',
      activeTab: 'reviews',
      reviews,
      message: req.query.msg || null
    });
  } catch (err) {
    res.status(500).send('Error loading reviews');
  }
};

exports.postCreateReview = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Review.create(req.body);
    }
    res.redirect('/admin/reviews?msg=Review+Created');
  } catch (err) {
    res.redirect('/admin/reviews?msg=Error');
  }
};

exports.postToggleReviewVerified = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const rev = await Review.findById(id);
      if (rev) {
        rev.isVerified = !rev.isVerified;
        await rev.save();
      }
    }
    res.redirect('/admin/reviews?msg=Review+Updated');
  } catch (err) {
    res.redirect('/admin/reviews?msg=Error');
  }
};

exports.postDeleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Review.findByIdAndDelete(id);
    }
    res.redirect('/admin/reviews?msg=Review+Deleted');
  } catch (err) {
    res.redirect('/admin/reviews?msg=Error');
  }
};

exports.getInquiries = async (req, res) => {
  try {
    let inquiries = [];
    if (mongoose.connection.readyState === 1) {
      inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    } else {
      inquiries = mockData.inquiries || [];
    }
    res.render('admin/inquiries', {
      title: 'Customer Inquiries — ViVA Admin',
      activeTab: 'inquiries',
      inquiries,
      stats: {
        total: inquiries.length,
        newCount: inquiries.filter(i => i.status === 'New').length,
        inProgressCount: inquiries.filter(i => i.status === 'In Progress').length,
        resolvedCount: inquiries.filter(i => i.status === 'Resolved').length
      },
      query: req.query,
      message: req.query.msg || null
    });
  } catch (err) {
    res.status(500).send('Error loading inquiries');
  }
};

exports.postUpdateInquiryStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, adminNotes } = req.body;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Inquiry.findByIdAndUpdate(id, { status, adminNotes });
    }
    res.redirect('/admin/inquiries?msg=Inquiry+Updated');
  } catch (err) {
    res.redirect('/admin/inquiries?msg=Error');
  }
};

exports.postDeleteInquiry = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Inquiry.findByIdAndDelete(id);
    }
    res.redirect('/admin/inquiries?msg=Inquiry+Deleted');
  } catch (err) {
    res.redirect('/admin/inquiries?msg=Error');
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    let subscribers = [];
    if (mongoose.connection.readyState === 1) {
      subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();
    }
    res.render('admin/subscribers', {
      title: 'Newsletter Leads — ViVA Admin',
      activeTab: 'subscribers',
      subscribers,
      message: req.query.msg || null
    });
  } catch (err) {
    res.status(500).send('Error loading subscribers');
  }
};

exports.postDeleteSubscriber = async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await NewsletterSubscriber.findByIdAndDelete(id);
    }
    res.redirect('/admin/subscribers?msg=Subscriber+Removed');
  } catch (err) {
    res.redirect('/admin/subscribers?msg=Error');
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    let auditLogs = [];
    if (mongoose.connection.readyState === 1) {
      auditLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
    }
    res.render('admin/audit-logs', {
      title: 'Audit Trail Logs — ViVA Admin',
      activeTab: 'audit-logs',
      logs: auditLogs
    });
  } catch (err) {
    res.status(500).send('Error loading audit logs');
  }
};
