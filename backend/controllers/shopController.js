const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const mockData = require('../seeds/mock-data');

// Helper to get products (from DB or fallback)
async function getProducts() {
  if (mongoose.connection.readyState === 1) {
    try {
      const dbProds = await Product.find();
      if (dbProds && dbProds.length > 0) return dbProds;
    } catch (e) {
      console.warn('Error fetching products from DB:', e.message);
    }
  }
  return mockData.products;
}

// Helper to get categories (from DB or fallback)
async function getCategories() {
  if (mongoose.connection.readyState === 1) {
    try {
      const dbCats = await Category.find().sort({ sortOrder: 1 });
      if (dbCats && dbCats.length > 0) return dbCats;
    } catch (e) {
      console.warn('Error fetching categories from DB:', e.message);
    }
  }
  return mockData.categories;
}

// 1. Catalog / Shop Page
exports.getShopPage = async (req, res) => {
  try {
    const selectedCategory = req.query.category || 'all';
    const sortBy = req.query.sort || 'featured';
    const searchQuery = req.query.q || '';
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 500;

    let allProducts = await getProducts();
    const categories = await getCategories();

    // Filter by Category
    let filtered = allProducts;
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase() ||
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Price
    filtered = filtered.filter(p => p.salePrice >= minPrice && p.salePrice <= maxPrice);

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
    } else if (sortBy === 'discount') {
      filtered.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    }

    res.render('pages/shop', {
      title: 'Shop All Products — ViVA (Live Better)',
      activePage: 'shop',
      products: filtered,
      totalCount: filtered.length,
      categories,
      selectedCategory,
      sortBy,
      searchQuery,
      minPrice,
      maxPrice,
      cartCount: req.session.cartCount || 2,
      wishlistCount: req.session.wishlistCount || 3
    });
  } catch (err) {
    console.error('Shop page error:', err);
    res.status(500).send('Error loading shop catalog');
  }
};

// 2. Product Detail Page (PDP)
exports.getProductDetail = async (req, res) => {
  try {
    const slug = req.params.slug;
    let product = null;

    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(slug) ? { _id: slug } : { slug: slug };
        product = await Product.findOne(query);
      } catch (e) {
        console.warn('DB query error for product:', e.message);
      }
    }

    const allProducts = await getProducts();
    if (!product) {
      product = allProducts.find(p => p.slug === slug || String(p._id) === slug) || allProducts[0];
    }

    const categories = await getCategories();

    // Related products in same category or catalog items
    const relatedProducts = allProducts
      .filter(p => p.slug !== product.slug && String(p._id) !== String(product._id))
      .slice(0, 4);

    res.render('pages/product-detail', {
      title: `${product.name} — ViVA (Live Better)`,
      activePage: 'shop',
      product,
      relatedProducts,
      categories,
      reviews: mockData.reviews,
      cartCount: req.session.cartCount || 2,
      wishlistCount: req.session.wishlistCount || 3
    });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).send('Error loading product details');
  }
};

// 3. All Categories Directory
exports.getCategoriesPage = async (req, res) => {
  try {
    const categories = await getCategories();
    const allProducts = await getProducts();

    // Map categories with product counts and preview items
    const categoryDirectory = categories.filter(c => c.slug !== 'all').map(cat => {
      const items = allProducts.filter(p => 
        p.category.toLowerCase().replace(/\s+/g, '-') === cat.slug.toLowerCase() ||
        p.category.toLowerCase() === cat.name.toLowerCase()
      );
      return {
        ...cat.toObject ? cat.toObject() : cat,
        productCount: items.length || 12,
        sampleProduct: items[0] || allProducts[0]
      };
    });

    res.render('pages/categories', {
      title: 'All Categories — ViVA (Live Better)',
      activePage: 'categories',
      categories: categoryDirectory,
      cartCount: req.session.cartCount || 2,
      wishlistCount: req.session.wishlistCount || 3
    });
  } catch (err) {
    console.error('Categories page error:', err);
    res.status(500).send('Error loading categories');
  }
};
