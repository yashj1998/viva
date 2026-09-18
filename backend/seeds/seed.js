const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');

// Models
const Category = require('../models/Category');
const Product = require('../models/Product');
const HeroSlide = require('../models/HeroSlide');
const PromoBanner = require('../models/PromoBanner');
const Review = require('../models/Review');
const AdminUser = require('../models/AdminUser');
const User = require('../models/User');
const Order = require('../models/Order');
const InventoryLog = require('../models/InventoryLog');
const SiteSetting = require('../models/SiteSetting');
const TopPickSetting = require('../models/TopPickSetting');
const Inquiry = require('../models/Inquiry');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { hashPassword } = require('../utils/passwordHelper');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/viva_ecommerce';

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas successfully.');

    // 1. Clear existing collections
    await Promise.all([
      AdminUser.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      InventoryLog.deleteMany({}),
      SiteSetting.deleteMany({}),
      TopPickSetting.deleteMany({}),
      HeroSlide.deleteMany({}),
      PromoBanner.deleteMany({}),
      Review.deleteMany({}),
      Inquiry.deleteMany({}),
      NewsletterSubscriber.deleteMany({})
    ]);
    console.log('🧹 Cleared all collections.');

    // 2. Seed Admin and Seller Users
    const adminPass = 'admin123';
    const sellerPass = 'seller123';
    const managerPass = 'manager123';
    const supportPass = 'support123';

    const [adminUser, sellerUser, managerUser, supportUser] = await AdminUser.create([
      {
        name: 'Yash Joshi (Super Admin)',
        email: 'admin@viva.com',
        password: adminPass,
        role: 'admin',
        status: 'active',
        avatarUrl: '/images/avatars/sarah.jpg',
        storeName: 'ViVA Flagship Store',
        storeSlug: 'viva-flagship',
        storeDescription: 'Official flagship store for ViVA living products and curated collections.',
        logoUrl: '/images/viva-logo.png',
        bannerUrl: '/images/hero-composite.png',
        businessEmail: 'corporate@viva.com',
        businessPhone: '+1 (800) 848-2548',
        businessAddress: '742 Evergreen Terrace, Springfield, OR 97477',
        businessInfo: {
          taxId: 'TAX-US-892401',
          registrationNumber: 'VIVA-GLOBAL-01',
          returnPolicy: '30-day no hassle returns with free pre-paid return shipping.',
          shippingPolicy: 'Free standard shipping on all orders over $49.'
        }
      },
      {
        name: 'Apex Modern Living',
        email: 'seller@viva.com',
        password: sellerPass,
        role: 'seller',
        status: 'active',
        avatarUrl: '/images/avatars/priya.jpg',
        storeName: 'Apex Modern Living',
        storeSlug: 'apex-modern-living',
        storeDescription: 'Premier provider of high-grade acoustic audio gear, modern lighting, and minimalist lifestyle essentials.',
        logoUrl: '/images/viva-logo.png',
        bannerUrl: '/images/banners/armchair.png',
        businessEmail: 'contact@apexliving.com',
        businessPhone: '+1 (555) 789-0123',
        businessAddress: '100 Innovation Way, Suite 400, Austin, TX 78701',
        businessInfo: {
          taxId: 'TAX-TX-781920',
          registrationNumber: 'REG-2024-APEX',
          returnPolicy: '30-day satisfaction guarantee. Full refund or replacement on damaged items.',
          shippingPolicy: 'Dispatches within 24 hours. Priority delivery across continental US.'
        }
      },
      {
        name: 'Elena Rostova (Operations Manager)',
        email: 'manager@viva.com',
        password: managerPass,
        role: 'manager',
        status: 'active',
        avatarUrl: '/images/avatars/priya.jpg',
        storeName: 'ViVA Operations',
        storeSlug: 'viva-ops'
      },
      {
        name: 'Marcus Vance (Customer Care)',
        email: 'support@viva.com',
        password: supportPass,
        role: 'support',
        status: 'active',
        avatarUrl: '/images/avatars/michael.jpg',
        storeName: 'ViVA Customer Support',
        storeSlug: 'viva-support'
      }
    ]);
    console.log(`👤 Created ${4} Admin & Seller users (admin@viva.com / admin123, seller@viva.com / seller123).`);

    // 3. Seed Registered Customers
    const defaultCustPass = hashPassword('Customer123!');
    const customersData = [
      {
        name: 'Alex Morgan',
        email: 'alex@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 234-5678',
        role: 'vip',
        status: 'active',
        addresses: [{ street: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', zip: '97477', country: 'United States', isDefault: true }]
      },
      {
        name: 'Sophia Chen',
        email: 'sophia@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 876-5432',
        role: 'customer',
        status: 'active',
        addresses: [{ street: '120 Pike St', city: 'Seattle', state: 'WA', zip: '98101', country: 'United States', isDefault: true }]
      },
      {
        name: 'Marcus Brody',
        email: 'marcus@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 456-7890',
        role: 'customer',
        status: 'active',
        addresses: [{ street: '450 Congress Ave', city: 'Austin', state: 'TX', zip: '78701', country: 'United States', isDefault: true }]
      },
      {
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 345-6789',
        role: 'vip',
        status: 'active',
        addresses: [{ street: '88 Franklin St', city: 'Boston', state: 'MA', zip: '02110', country: 'United States', isDefault: true }]
      },
      {
        name: 'David Kim',
        email: 'david.kim@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 678-9012',
        role: 'customer',
        status: 'active',
        addresses: [{ street: '350 5th Ave', city: 'New York', state: 'NY', zip: '10118', country: 'United States', isDefault: true }]
      },
      {
        name: 'Jessica Taylor',
        email: 'jessica.t@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 789-1234',
        role: 'wholesale',
        status: 'active',
        addresses: [{ street: '200 N Michigan Ave', city: 'Chicago', state: 'IL', zip: '60601', country: 'United States', isDefault: true }]
      },
      {
        name: 'Lucas Martinez',
        email: 'lucas.m@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 890-2345',
        role: 'customer',
        status: 'active',
        addresses: [{ street: '100 Biscayne Blvd', city: 'Miami', state: 'FL', zip: '33132', country: 'United States', isDefault: true }]
      },
      {
        name: 'Olivia Wilson',
        email: 'olivia.w@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 901-3456',
        role: 'vip',
        status: 'active',
        addresses: [{ street: '500 Market St', city: 'San Francisco', state: 'CA', zip: '94105', country: 'United States', isDefault: true }]
      },
      {
        name: 'Ethan Hunt',
        email: 'ethan.h@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 012-4567',
        role: 'customer',
        status: 'suspended',
        addresses: [{ street: '1600 17th St', city: 'Denver', state: 'CO', zip: '80202', country: 'United States', isDefault: true }]
      },
      {
        name: 'Ava Johnson',
        email: 'ava.j@example.com',
        passwordHash: defaultCustPass.hash,
        salt: defaultCustPass.salt,
        phone: '+1 (555) 123-5678',
        role: 'customer',
        status: 'active',
        addresses: [{ street: '700 SW 5th Ave', city: 'Portland', state: 'OR', zip: '97204', country: 'United States', isDefault: true }]
      }
    ];
    const createdCustomers = await User.create(customersData);
    console.log(`🛍️ Created ${createdCustomers.length} registered customers.`);

    // 4. Seed Categories
    const categoriesData = [
      { name: 'Electronics', slug: 'electronics', iconClass: 'fa-solid fa-laptop', bgColor: '#e6edf5', iconColor: '#123524', sortOrder: 1, isFeatured: true },
      { name: 'Fashion', slug: 'fashion', iconClass: 'fa-solid fa-shirt', bgColor: '#f7ece2', iconColor: '#123524', sortOrder: 2, isFeatured: true },
      { name: 'Home & Living', slug: 'home-living', iconClass: 'fa-solid fa-couch', bgColor: '#eef1e6', iconColor: '#123524', sortOrder: 3, isFeatured: true },
      { name: 'Beauty', slug: 'beauty', iconClass: 'fa-solid fa-wand-magic-sparkles', bgColor: '#fbe8e6', iconColor: '#123524', sortOrder: 4, isFeatured: true },
      { name: 'Sports', slug: 'sports', iconClass: 'fa-solid fa-dumbbell', bgColor: '#fef3c7', iconColor: '#123524', sortOrder: 5, isFeatured: true },
      { name: 'Toys & Kids', slug: 'toys-kids', iconClass: 'fa-solid fa-shapes', bgColor: '#f3e8ff', iconColor: '#123524', sortOrder: 6, isFeatured: true },
      { name: 'Books', slug: 'books', iconClass: 'fa-solid fa-book-open', bgColor: '#e0f2fe', iconColor: '#123524', sortOrder: 7, isFeatured: true },
      { name: 'Pet Supplies', slug: 'pet-supplies', iconClass: 'fa-solid fa-paw', bgColor: '#fce7f3', iconColor: '#123524', sortOrder: 8, isFeatured: true },
      { name: 'Kitchen & Dining', slug: 'kitchen-dining', iconClass: 'fa-solid fa-utensils', bgColor: '#ffedd5', iconColor: '#123524', sortOrder: 9, isFeatured: true },
      { name: 'Health & Wellness', slug: 'health-wellness', iconClass: 'fa-solid fa-heart-pulse', bgColor: '#ecfdf5', iconColor: '#123524', sortOrder: 10, isFeatured: true }
    ];
    const createdCategories = await Category.create(categoriesData);
    console.log(`🏷️ Created ${createdCategories.length} categories.`);

    // 5. Seed Products Catalog (with SKUs, stock levels, variants, seller links)
    const productsData = [
      {
        name: 'Sony Ultra ANC Wireless Headphones',
        slug: 'sony-ultra-anc-wireless-headphones',
        sku: 'VIVA-ELE-001',
        category: 'Electronics',
        price: 99.99,
        salePrice: 79.99,
        discountPercent: 20,
        ratingAvg: 4.9,
        ratingCount: 1234,
        primaryImageUrl: '/images/products/headphones.png',
        galleryImages: ['/images/products/headphones.png', '/images/banners/smartwatch.png'],
        isTopPick: true,
        badgeText: 'HOT DEAL',
        sortOrder: 1,
        stockQuantity: 45,
        lowStockThreshold: 10,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'Sony Audio',
        colors: ['Obsidian Black', 'Silver Mist', 'Midnight Blue'],
        sizes: ['Standard Edition', 'Travel Case Bundle'],
        variants: [
          { sku: 'VIVA-ELE-001-BLK', name: 'Black - Standard', color: 'Obsidian Black', size: 'Standard Edition', price: 79.99, stock: 30 },
          { sku: 'VIVA-ELE-001-SLV', name: 'Silver - Bundle', color: 'Silver Mist', size: 'Travel Case Bundle', price: 89.99, stock: 15 }
        ],
        description: 'Industry-leading Active Noise Cancellation with bespoke 40mm drivers and 30-hour battery life. Perfect for travel, remote focus, and immersive audio listening.'
      },
      {
        name: 'Linen Casual Long-Sleeve Shirt',
        slug: 'linen-casual-long-sleeve-shirt',
        sku: 'VIVA-FAS-002',
        category: 'Fashion',
        price: 39.99,
        salePrice: 29.99,
        discountPercent: 25,
        ratingAvg: 4.8,
        ratingCount: 812,
        primaryImageUrl: '/images/products/linen-shirt.png',
        galleryImages: ['/images/products/linen-shirt.png', '/images/banners/handbag.png'],
        isTopPick: true,
        badgeText: 'BESTSELLER',
        sortOrder: 2,
        stockQuantity: 60,
        lowStockThreshold: 12,
        status: 'published',
        seller: adminUser._id,
        sellerName: 'ViVA Flagship Store',
        brand: 'ViVA Atelier',
        colors: ['Natural Oatmeal', 'Sage Green', 'Classic Navy'],
        sizes: ['S', 'M', 'L', 'XL'],
        variants: [
          { sku: 'VIVA-FAS-002-MED', name: 'Oatmeal - M', color: 'Natural Oatmeal', size: 'M', price: 29.99, stock: 25 },
          { sku: 'VIVA-FAS-002-LRG', name: 'Sage - L', color: 'Sage Green', size: 'L', price: 29.99, stock: 35 }
        ],
        description: 'Breathable pure European flax linen tailored with a modern relaxed cut. Pre-washed for soft hand-feel and durable year-round layering.'
      },
      {
        name: 'Minimalist Niacinamide Facial Serum',
        slug: 'minimalist-niacinamide-facial-serum',
        sku: 'VIVA-BEA-003',
        category: 'Beauty',
        price: 19.99,
        salePrice: 16.99,
        discountPercent: 15,
        ratingAvg: 4.9,
        ratingCount: 645,
        primaryImageUrl: '/images/products/serum.png',
        galleryImages: ['/images/products/serum.png'],
        isTopPick: true,
        badgeText: 'STAFF PICK',
        sortOrder: 3,
        stockQuantity: 6, // LOW STOCK TRIGGER
        lowStockThreshold: 15,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'PureBotanics',
        colors: ['Unscented Clear'],
        sizes: ['30ml Dropper', '60ml Value Size'],
        variants: [
          { sku: 'VIVA-BEA-003-30', name: '30ml', color: 'Clear', size: '30ml', price: 16.99, stock: 4 },
          { sku: 'VIVA-BEA-003-60', name: '60ml', color: 'Clear', size: '60ml', price: 28.99, stock: 2 }
        ],
        description: 'Concentrated 10% Niacinamide and 1% Zinc serum designed to balance oil, refine pores, and enhance skin radiance without synthetic fragrances.'
      },
      {
        name: 'Compact Espresso Coffee Maker',
        slug: 'compact-espresso-coffee-maker',
        sku: 'VIVA-HOM-004',
        category: 'Home & Living',
        price: 69.99,
        salePrice: 48.99,
        discountPercent: 30,
        ratingAvg: 4.7,
        ratingCount: 963,
        primaryImageUrl: '/images/products/coffee-maker.png',
        galleryImages: ['/images/products/coffee-maker.png', '/images/banners/armchair.png'],
        isTopPick: true,
        badgeText: 'POPULAR',
        sortOrder: 4,
        stockQuantity: 30,
        lowStockThreshold: 8,
        status: 'published',
        seller: adminUser._id,
        sellerName: 'ViVA Flagship Store',
        brand: 'BaristaCraft',
        colors: ['Matte Black', 'Stainless Silver'],
        sizes: ['Standard Single Cup', 'Dual Pour'],
        variants: [
          { sku: 'VIVA-HOM-004-BLK', name: 'Matte Black', color: 'Matte Black', size: 'Standard', price: 48.99, stock: 20 },
          { sku: 'VIVA-HOM-004-SLV', name: 'Silver', color: 'Stainless Silver', size: 'Standard', price: 48.99, stock: 10 }
        ],
        description: '15-bar Italian pressure pump in a counter-friendly slim footprint. Rapid thermal heating delivers barista-quality espresso in under 45 seconds.'
      },
      {
        name: 'Urban Waterproof Travel Backpack',
        slug: 'urban-waterproof-travel-backpack',
        sku: 'VIVA-FAS-005',
        category: 'Fashion',
        price: 49.99,
        salePrice: 39.99,
        discountPercent: 20,
        ratingAvg: 4.8,
        ratingCount: 1108,
        primaryImageUrl: '/images/products/backpack.png',
        galleryImages: ['/images/products/backpack.png'],
        isTopPick: true,
        badgeText: 'TRENDING',
        sortOrder: 5,
        stockQuantity: 75,
        lowStockThreshold: 10,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'NomadGear',
        colors: ['Charcoal Gray', 'Desert Tan', 'Forest Green'],
        sizes: ['22L Daily', '28L Weekender'],
        variants: [
          { sku: 'VIVA-FAS-005-22', name: '22L Charcoal', color: 'Charcoal Gray', size: '22L', price: 39.99, stock: 45 },
          { sku: 'VIVA-FAS-005-28', name: '28L Charcoal', color: 'Charcoal Gray', size: '28L', price: 49.99, stock: 30 }
        ],
        description: 'Weatherproof 900D Cordura nylon with padded 16-inch laptop compartment, luggage pass-through strap, and ergonomic air-mesh back ventilation.'
      },
      {
        name: 'Ceramic Minimalist Accent Table Lamp',
        slug: 'ceramic-minimalist-accent-table-lamp',
        sku: 'VIVA-HOM-006',
        category: 'Home & Living',
        price: 54.99,
        salePrice: 42.99,
        discountPercent: 22,
        ratingAvg: 4.9,
        ratingCount: 420,
        primaryImageUrl: '/images/banners/armchair.png',
        galleryImages: ['/images/banners/armchair.png'],
        isTopPick: false,
        badgeText: 'NEW',
        sortOrder: 6,
        stockQuantity: 4, // LOW STOCK TRIGGER
        lowStockThreshold: 10,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'Lumina Studio',
        colors: ['Warm Sandstone', 'Terracotta'],
        sizes: ['Medium 14-inch', 'Tall 18-inch'],
        variants: [
          { sku: 'VIVA-HOM-006-MED', name: 'Sandstone 14"', color: 'Warm Sandstone', size: 'Medium', price: 42.99, stock: 4 }
        ],
        description: 'Hand-cast ceramic base paired with linen drum shade. Integrated 3-stage touch dimmer produces soft 2700K ambient illumination.'
      },
      {
        name: 'Smart Hybrid GPS Fitness Watch',
        slug: 'smart-hybrid-gps-fitness-watch',
        sku: 'VIVA-ELE-007',
        category: 'Electronics',
        price: 129.99,
        salePrice: 99.99,
        discountPercent: 23,
        ratingAvg: 4.8,
        ratingCount: 512,
        primaryImageUrl: '/images/banners/smartwatch.png',
        galleryImages: ['/images/banners/smartwatch.png'],
        isTopPick: false,
        badgeText: 'PREMIUM',
        sortOrder: 7,
        stockQuantity: 40,
        lowStockThreshold: 10,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'PulseTech',
        colors: ['Midnight Titanium', 'Rose Gold'],
        sizes: ['42mm Dial', '46mm Dial'],
        variants: [
          { sku: 'VIVA-ELE-007-42', name: 'Titanium 42mm', color: 'Midnight Titanium', size: '42mm', price: 99.99, stock: 25 },
          { sku: 'VIVA-ELE-007-46', name: 'Titanium 46mm', color: 'Midnight Titanium', size: '46mm', price: 119.99, stock: 15 }
        ],
        description: 'Combines analog watch styling with hidden OLED metrics: continuous heart rate, sleep tracking, SpO2, and 14-day battery life.'
      },
      {
        name: 'Luxury Italian Leather Shoulder Bag',
        slug: 'luxury-italian-leather-shoulder-bag',
        sku: 'VIVA-FAS-008',
        category: 'Fashion',
        price: 89.99,
        salePrice: 69.99,
        discountPercent: 22,
        ratingAvg: 4.9,
        ratingCount: 310,
        primaryImageUrl: '/images/banners/handbag.png',
        galleryImages: ['/images/banners/handbag.png'],
        isTopPick: false,
        badgeText: 'LUXURY',
        sortOrder: 8,
        stockQuantity: 0, // OUT OF STOCK TRIGGER
        lowStockThreshold: 8,
        status: 'published',
        seller: adminUser._id,
        sellerName: 'ViVA Flagship Store',
        brand: 'ViVA Atelier',
        colors: ['Cognac Tan', 'Noir Black'],
        sizes: ['One Size'],
        variants: [
          { sku: 'VIVA-FAS-008-COG', name: 'Cognac Tan', color: 'Cognac Tan', size: 'One Size', price: 69.99, stock: 0 }
        ],
        description: 'Supple full-grain calfskin leather with polished brass hardware. Includes detachable crossbody strap and interior microfiber zip pocket.'
      },
      {
        name: 'Non-Slip Eco Cork Yoga Mat & Strap',
        slug: 'non-slip-eco-cork-yoga-mat',
        sku: 'VIVA-SPO-009',
        category: 'Sports',
        price: 44.99,
        salePrice: 34.99,
        discountPercent: 22,
        ratingAvg: 4.8,
        ratingCount: 284,
        primaryImageUrl: '/images/products/backpack.png',
        galleryImages: ['/images/products/backpack.png'],
        isTopPick: false,
        badgeText: 'ECO FRIENDLY',
        sortOrder: 9,
        stockQuantity: 28,
        lowStockThreshold: 10,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'ZenMotion',
        colors: ['Natural Cork'],
        sizes: ['6mm Pro Cushion (72x24)'],
        variants: [
          { sku: 'VIVA-SPO-009-STD', name: 'Natural Cork 6mm', color: 'Natural Cork', size: '6mm', price: 34.99, stock: 28 }
        ],
        description: 'Sustainable organic cork surface bonded with natural tree rubber base. Antimicrobial, non-toxic, and grippier the more you sweat.'
      },
      {
        name: 'Stainless Vacuum Insulated Water Flask',
        slug: 'stainless-vacuum-insulated-water-flask',
        sku: 'VIVA-SPO-010',
        category: 'Sports',
        price: 24.99,
        salePrice: 19.99,
        discountPercent: 20,
        ratingAvg: 4.9,
        ratingCount: 780,
        primaryImageUrl: '/images/products/coffee-maker.png',
        galleryImages: ['/images/products/coffee-maker.png'],
        isTopPick: false,
        badgeText: 'BEST VALUE',
        sortOrder: 10,
        stockQuantity: 55,
        lowStockThreshold: 15,
        status: 'published',
        seller: adminUser._id,
        sellerName: 'ViVA Flagship Store',
        brand: 'HydroPro',
        colors: ['Matte Black', 'Arctic White', 'Forest Green'],
        sizes: ['32 oz Wide Mouth'],
        variants: [
          { sku: 'VIVA-SPO-010-32', name: '32 oz Flask', color: 'Matte Black', size: '32 oz', price: 19.99, stock: 55 }
        ],
        description: 'Double-wall vacuum insulation keeps liquids cold for 24 hours or piping hot for 12 hours. Pro-grade 18/8 stainless steel construction.'
      },
      {
        name: 'The Art of Modern Living: Design Monograph',
        slug: 'the-art-of-modern-living-design-monograph',
        sku: 'VIVA-BOK-011',
        category: 'Books',
        price: 35.00,
        salePrice: 28.00,
        discountPercent: 20,
        ratingAvg: 5.0,
        ratingCount: 140,
        primaryImageUrl: '/images/hero-composite.png',
        galleryImages: ['/images/hero-composite.png'],
        isTopPick: false,
        badgeText: 'HARDCOVER',
        sortOrder: 11,
        stockQuantity: 18,
        lowStockThreshold: 5,
        status: 'published',
        seller: adminUser._id,
        sellerName: 'ViVA Flagship Store',
        brand: 'ViVA Publishing',
        colors: ['Linen Hardcover'],
        sizes: ['Collector Edition (320 pages)'],
        variants: [
          { sku: 'VIVA-BOK-011-HC', name: 'Hardcover Monograph', color: 'Linen', size: 'Hardcover', price: 28.00, stock: 18 }
        ],
        description: 'An architectural exploration of Scandinavian, Japanese, and mid-century modern residences with 400 full-color studio photographs.'
      },
      {
        name: 'Orthopedic Memory Foam Pet Bed',
        slug: 'orthopedic-memory-foam-pet-bed',
        sku: 'VIVA-PET-012',
        category: 'Pet Supplies',
        price: 59.99,
        salePrice: 47.99,
        discountPercent: 20,
        ratingAvg: 4.8,
        ratingCount: 390,
        primaryImageUrl: '/images/banners/armchair.png',
        galleryImages: ['/images/banners/armchair.png'],
        isTopPick: false,
        badgeText: 'PET APPROVED',
        sortOrder: 12,
        stockQuantity: 8, // LOW STOCK TRIGGER
        lowStockThreshold: 10,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'Paws & Living',
        colors: ['Heather Gray', 'Warm Beige'],
        sizes: ['Medium (36x28")', 'Large (44x34")'],
        variants: [
          { sku: 'VIVA-PET-012-MED', name: 'Medium Bed', color: 'Heather Gray', size: 'Medium', price: 47.99, stock: 5 },
          { sku: 'VIVA-PET-012-LRG', name: 'Large Bed', color: 'Heather Gray', size: 'Large', price: 64.99, stock: 3 }
        ],
        description: 'Dual-layer therapeutic memory foam base relieves joint tension for dogs of all ages. Removable, machine-washable plush cover.'
      },
      {
        name: 'Modular Wooden Montessori Building Blocks',
        slug: 'modular-wooden-montessori-building-blocks',
        sku: 'VIVA-TOY-013',
        category: 'Toys & Kids',
        price: 34.99,
        salePrice: 27.99,
        discountPercent: 20,
        ratingAvg: 4.9,
        ratingCount: 215,
        primaryImageUrl: '/images/banners/armchair.png',
        galleryImages: ['/images/banners/armchair.png'],
        isTopPick: false,
        badgeText: 'NON-TOXIC',
        sortOrder: 13,
        stockQuantity: 22,
        lowStockThreshold: 10,
        status: 'published',
        seller: adminUser._id,
        sellerName: 'ViVA Flagship Store',
        brand: 'LittleMinds',
        colors: ['Natural Beechwood'],
        sizes: ['60-Piece Set'],
        variants: [
          { sku: 'VIVA-TOY-013-60', name: '60-Piece Block Set', color: 'Natural', size: '60pc', price: 27.99, stock: 22 }
        ],
        description: 'Crafted from sustainably harvested German beechwood with child-safe organic beeswax finish. Fosters tactile exploration and geometry skills.'
      },
      {
        name: 'Japanese High-Carbon Steel Chef Knife',
        slug: 'japanese-high-carbon-steel-chef-knife',
        sku: 'VIVA-KIT-014',
        category: 'Kitchen & Dining',
        price: 89.99,
        salePrice: 69.99,
        discountPercent: 22,
        ratingAvg: 4.9,
        ratingCount: 540,
        primaryImageUrl: '/images/products/headphones.png',
        galleryImages: ['/images/products/headphones.png'],
        isTopPick: false,
        badgeText: 'CHEF GRADE',
        sortOrder: 14,
        stockQuantity: 15,
        lowStockThreshold: 8,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'Kurogane Cutlery',
        colors: ['Rosewood Handle'],
        sizes: ['8-inch Gyuto'],
        variants: [
          { sku: 'VIVA-KIT-014-8', name: '8" Gyuto Knife', color: 'Rosewood', size: '8-inch', price: 69.99, stock: 15 }
        ],
        description: 'Forged 67-layer Damascus steel clad over a VG-10 core hardened to 60+ HRC. Razor sharp 15-degree edge bevel for surgical slicing precision.'
      },
      {
        name: 'Ultrasonic Ceramic Aromatherapy Diffuser',
        slug: 'ultrasonic-ceramic-aromatherapy-diffuser',
        sku: 'VIVA-HEA-015',
        category: 'Health & Wellness',
        price: 39.99,
        salePrice: 29.99,
        discountPercent: 25,
        ratingAvg: 4.8,
        ratingCount: 320,
        primaryImageUrl: '/images/banners/armchair.png',
        galleryImages: ['/images/banners/armchair.png'],
        isTopPick: false,
        badgeText: 'RELAXATION',
        sortOrder: 15,
        stockQuantity: 2, // LOW STOCK TRIGGER
        lowStockThreshold: 10,
        status: 'published',
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'SereneSpace',
        colors: ['Matte White Ceramic'],
        sizes: ['250ml Tank'],
        variants: [
          { sku: 'VIVA-HEA-015-250', name: '250ml Diffuser', color: 'Matte White', size: '250ml', price: 29.99, stock: 2 }
        ],
        description: 'Whisper-quiet 2.4MHz ultrasonic vibration transforms pure water and essential oils into ultra-fine cool mist. Warm LED night halo with auto shutoff.'
      },
      {
        name: 'Draft Concept Smart Lightstrip Pro',
        slug: 'draft-concept-smart-lightstrip-pro',
        sku: 'VIVA-ELE-016',
        category: 'Electronics',
        price: 49.99,
        salePrice: 44.99,
        discountPercent: 10,
        ratingAvg: 4.5,
        ratingCount: 0,
        primaryImageUrl: '/images/banners/smartwatch.png',
        galleryImages: ['/images/banners/smartwatch.png'],
        isTopPick: false,
        badgeText: 'COMING SOON',
        sortOrder: 16,
        stockQuantity: 0,
        lowStockThreshold: 10,
        status: 'draft', // DRAFT PRODUCT FOR TESTING
        seller: sellerUser._id,
        sellerName: 'Apex Modern Living',
        brand: 'Lumina Studio',
        colors: ['RGB Multi-Zone'],
        sizes: ['2 Meter Strip'],
        variants: [],
        description: 'Next-generation individually addressable RGBIC strip with millimeter wave music sync and Matter smart home protocol support.'
      }
    ];
    const createdProducts = await Product.create(productsData);
    console.log(`📦 Created ${createdProducts.length} rich catalog products with SKUs and inventory.`);

    // 6. Seed Realistic Orders Across the Past 30 Days (for genuine chart & analytics grouping)
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const ordersTemplate = [
      // Day 0 (Today)
      {
        daysAgo: 0.1,
        customer: createdCustomers[0],
        status: 'Ordered',
        paymentStatus: 'Paid',
        shippingStatus: 'Unfulfilled',
        paymentMethod: 'Apple Pay',
        items: [
          { product: createdProducts[0], qty: 1 },
          { product: createdProducts[2], qty: 2 }
        ]
      },
      {
        daysAgo: 0.25,
        customer: createdCustomers[1],
        status: 'Processing',
        paymentStatus: 'Paid',
        shippingStatus: 'Unfulfilled',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[1], qty: 1 }
        ]
      },
      {
        daysAgo: 0.4,
        customer: createdCustomers[2],
        status: 'Ordered',
        paymentStatus: 'Pending',
        shippingStatus: 'Unfulfilled',
        paymentMethod: 'PayPal',
        items: [
          { product: createdProducts[3], qty: 1 }
        ]
      },
      // Day 1 (Yesterday)
      {
        daysAgo: 1.1,
        customer: createdCustomers[3],
        status: 'Shipped',
        paymentStatus: 'Paid',
        shippingStatus: 'In Transit',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[0], qty: 2 },
          { product: createdProducts[4], qty: 1 }
        ]
      },
      {
        daysAgo: 1.6,
        customer: createdCustomers[4],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[9], qty: 2 }
        ]
      },
      // Day 2
      {
        daysAgo: 2.2,
        customer: createdCustomers[5],
        status: 'Shipped',
        paymentStatus: 'Paid',
        shippingStatus: 'In Transit',
        paymentMethod: 'PayPal',
        items: [
          { product: createdProducts[13], qty: 1 },
          { product: createdProducts[1], qty: 2 }
        ]
      },
      {
        daysAgo: 2.8,
        customer: createdCustomers[6],
        status: 'Processing',
        paymentStatus: 'Paid',
        shippingStatus: 'Unfulfilled',
        paymentMethod: 'Apple Pay',
        items: [
          { product: createdProducts[5], qty: 1 }
        ]
      },
      // Day 3
      {
        daysAgo: 3.1,
        customer: createdCustomers[7],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[6], qty: 1 }
        ]
      },
      {
        daysAgo: 3.7,
        customer: createdCustomers[0],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[2], qty: 1 },
          { product: createdProducts[9], qty: 1 }
        ]
      },
      // Day 4
      {
        daysAgo: 4.3,
        customer: createdCustomers[1],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Apple Pay',
        items: [
          { product: createdProducts[4], qty: 1 },
          { product: createdProducts[10], qty: 1 }
        ]
      },
      // Day 5
      {
        daysAgo: 5.2,
        customer: createdCustomers[2],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[0], qty: 1 },
          { product: createdProducts[3], qty: 1 }
        ]
      },
      {
        daysAgo: 5.9,
        customer: createdCustomers[8],
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        shippingStatus: 'Returned',
        paymentMethod: 'PayPal',
        items: [
          { product: createdProducts[6], qty: 1 }
        ]
      },
      // Day 6
      {
        daysAgo: 6.2,
        customer: createdCustomers[9],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[11], qty: 1 }
        ]
      },
      {
        daysAgo: 6.8,
        customer: createdCustomers[3],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Apple Pay',
        items: [
          { product: createdProducts[1], qty: 1 },
          { product: createdProducts[8], qty: 1 }
        ]
      },
      // Day 8
      {
        daysAgo: 8.4,
        customer: createdCustomers[4],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[0], qty: 1 }
        ]
      },
      // Day 12
      {
        daysAgo: 12.1,
        customer: createdCustomers[5],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[4], qty: 2 },
          { product: createdProducts[14], qty: 1 }
        ]
      },
      // Day 15
      {
        daysAgo: 15.3,
        customer: createdCustomers[6],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Apple Pay',
        items: [
          { product: createdProducts[3], qty: 1 }
        ]
      },
      // Day 18
      {
        daysAgo: 18.2,
        customer: createdCustomers[7],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'PayPal',
        items: [
          { product: createdProducts[1], qty: 2 }
        ]
      },
      // Day 21
      {
        daysAgo: 21.5,
        customer: createdCustomers[0],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[0], qty: 1 },
          { product: createdProducts[9], qty: 1 }
        ]
      },
      // Day 25
      {
        daysAgo: 25.1,
        customer: createdCustomers[1],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { product: createdProducts[6], qty: 1 }
        ]
      },
      // Day 28
      {
        daysAgo: 28.6,
        customer: createdCustomers[2],
        status: 'Delivered',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        paymentMethod: 'Apple Pay',
        items: [
          { product: createdProducts[4], qty: 1 },
          { product: createdProducts[1], qty: 1 }
        ]
      }
    ];

    const ordersToInsert = [];
    let orderNumSeq = 9820;

    for (const t of ordersTemplate) {
      const orderDate = new Date(now - t.daysAgo * oneDay);
      const custAddr = (t.customer.addresses && t.customer.addresses[0]) || {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
        country: 'United States'
      };

      const lineItems = t.items.map(it => {
        const p = it.product;
        return {
          productId: String(p._id),
          name: p.name,
          sku: p.sku || 'VIVA-SKU',
          price: p.salePrice || p.price,
          quantity: it.qty,
          image: p.primaryImageUrl,
          seller: p.seller
        };
      });

      const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingFee = subtotal >= 49 ? 0 : 5.99;
      const tax = parseFloat((subtotal * 0.085).toFixed(2));
      const total = parseFloat((subtotal + shippingFee + tax).toFixed(2));

      orderNumSeq++;
      const orderNumber = `VIVA-${orderNumSeq}`;

      const history = [
        {
          status: 'Ordered',
          paymentStatus: t.paymentStatus,
          shippingStatus: 'Unfulfilled',
          date: orderDate,
          note: 'Customer placed order through storefront checkout.',
          updatedBy: 'Storefront'
        }
      ];

      if (t.status === 'Processing' || t.status === 'Shipped' || t.status === 'Delivered') {
        history.push({
          status: 'Processing',
          paymentStatus: 'Paid',
          shippingStatus: 'Unfulfilled',
          date: new Date(orderDate.getTime() + 2 * 3600 * 1000),
          note: 'Payment captured and sent to warehouse for picking.',
          updatedBy: 'Operations'
        });
      }

      if (t.status === 'Shipped' || t.status === 'Delivered') {
        history.push({
          status: 'Shipped',
          paymentStatus: 'Paid',
          shippingStatus: 'In Transit',
          date: new Date(orderDate.getTime() + 18 * 3600 * 1000),
          note: 'Package dispatched via FedEx Ground (Tracking: TRK-' + orderNumSeq + 'US).',
          updatedBy: 'Fulfillment'
        });
      }

      if (t.status === 'Delivered') {
        history.push({
          status: 'Delivered',
          paymentStatus: 'Paid',
          shippingStatus: 'Delivered',
          date: new Date(orderDate.getTime() + 48 * 3600 * 1000),
          note: 'Package delivered at front door by carrier.',
          updatedBy: 'FedEx Webhook'
        });
      }

      if (t.status === 'Cancelled') {
        history.push({
          status: 'Cancelled',
          paymentStatus: 'Refunded',
          shippingStatus: 'Returned',
          date: new Date(orderDate.getTime() + 4 * 3600 * 1000),
          note: 'Order cancelled per customer request; full payment refunded.',
          updatedBy: 'Support Agent'
        });
      }

      ordersToInsert.push({
        orderNumber,
        customer: {
          name: t.customer.name,
          email: t.customer.email,
          phone: t.customer.phone,
          address: custAddr.street,
          city: custAddr.city,
          zip: custAddr.zip,
          country: custAddr.country
        },
        items: lineItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shippingFee,
        tax,
        total,
        status: t.status,
        paymentStatus: t.paymentStatus,
        shippingStatus: t.shippingStatus,
        trackingNumber: (t.status === 'Shipped' || t.status === 'Delivered') ? `TRK-${orderNumSeq}US` : '',
        carrier: 'FedEx Ground',
        statusHistory: history,
        estimatedDelivery: '3 - 5 business days',
        paymentMethod: t.paymentMethod,
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }

    const createdOrders = await Order.create(ordersToInsert);
    console.log(`🧾 Created ${createdOrders.length} realistic orders spanning 30-day timeline with full status history.`);

    // 7. Seed Initial Inventory Movement Logs
    const inventoryLogsData = [
      {
        product: createdProducts[0]._id,
        productName: createdProducts[0].name,
        sku: createdProducts[0].sku,
        seller: sellerUser._id,
        previousStock: 25,
        newStock: 45,
        changeAmount: 20,
        reason: 'Restock',
        note: 'Shipment received from manufacturer batch #SNY-2026-09.',
        updatedBy: 'Warehouse Manager'
      },
      {
        product: createdProducts[2]._id,
        productName: createdProducts[2].name,
        sku: createdProducts[2].sku,
        seller: sellerUser._id,
        previousStock: 10,
        newStock: 6,
        changeAmount: -4,
        reason: 'Order Placed',
        note: 'Deducted 4 units for customer orders.',
        updatedBy: 'System Auto-Deduct'
      },
      {
        product: createdProducts[7]._id,
        productName: createdProducts[7].name,
        sku: createdProducts[7].sku,
        seller: adminUser._id,
        previousStock: 5,
        newStock: 0,
        changeAmount: -5,
        reason: 'Order Placed',
        note: 'All remaining units sold out.',
        updatedBy: 'System Auto-Deduct'
      }
    ];
    await InventoryLog.create(inventoryLogsData);
    console.log(`📊 Created ${inventoryLogsData.length} baseline inventory audit logs.`);

    // 8. Seed Site & Top Pick Settings
    await SiteSetting.create({
      storeName: 'ViVA',
      tagline: 'Live Better — Modern Shopping For Everyday Living',
      announcementText: 'FLASH SALE: Extra 25% Off All Living Essentials Today Only!',
      announcementUrl: '/shop',
      freeShippingThreshold: 49.00,
      currencySymbol: '$',
      taxRate: 8.5,
      supportEmail: 'support@viva.com',
      supportPhone: '+1 (800) 848-2548',
      address: '742 Evergreen Terrace, Springfield, OR 97477',
      metaTitle: 'ViVA — Live Better | Modern Multi-Category Storefront',
      metaDescription: 'Discover quality curated essentials across electronics, fashion, home, beauty, sports, and more with everyday price guarantees.',
      metaKeywords: 'ecommerce, shopping, viva, electronics, home decor, beauty, modern living',
      ogImageUrl: '/images/hero-composite.png',
      logoUrl: '/images/viva-logo.png',
      bannerUrl: '/images/hero-composite.png',
      storeDescription: 'Modern shopping for everyday living with verified quality and deal-forward prices.',
      businessName: 'ViVA Modern Living Retail LLC',
      taxId: 'TAX-US-892401',
      returnPolicy: '30-day hassle-free returns with full refund guarantee.',
      shippingPolicy: 'Fast nationwide shipping with real-time tracking.',
      googleAnalyticsId: 'G-VIVA2026STORE',
      socialFacebook: 'https://facebook.com/viva.living',
      socialInstagram: 'https://instagram.com/viva.living',
      socialTwitter: 'https://x.com/viva_living'
    });

    await TopPickSetting.create({
      title: 'Top Picks For You',
      badge: '✨',
      subtitle: 'Handpicked deals and trending items tailored for modern living',
      seeAllText: 'See All Deals',
      seeAllUrl: '/shop',
      isActive: true,
      maxDisplayCount: 10
    });
    console.log(`⚙️ Seeded Site Settings and Top Picks configuration.`);

    // 9. Seed Hero Slides, Promo Banners, Reviews, Inquiries, Subscribers
    await HeroSlide.create([
      {
        headline: 'Elevate Your Everyday',
        subcopy: 'Discover curated lifestyle essentials, premium electronics, and home upgrades built to last.',
        ctaLabel: 'Shop Now →',
        ctaUrl: '/shop',
        imageUrl: '/images/hero-composite.png',
        badgeText: 'SUMMER SALE · UP TO 40% OFF',
        bgColor: '#f3efe3',
        sortOrder: 1,
        isActive: true
      },
      {
        headline: 'Smart Acoustic Sound',
        subcopy: 'Experience wireless noise-cancelling performance engineered for modern living.',
        ctaLabel: 'Explore Audio →',
        ctaUrl: '/shop?category=Electronics',
        imageUrl: '/images/products/headphones.png',
        badgeText: 'HOT DEAL · SAVE 20%',
        bgColor: '#e6edf5',
        sortOrder: 2,
        isActive: true
      }
    ]);

    await PromoBanner.create([
      {
        badgeLabel: 'New Arrivals',
        title: 'Fresh Styles\nJust In',
        ctaLabel: 'Shop Now →',
        ctaUrl: '/shop?category=Fashion',
        imageUrl: '/images/banners/handbag.png',
        themeBg: '#eef1e6',
        sortOrder: 1
      },
      {
        badgeLabel: 'Home Refresh',
        title: 'Make Your\nSpace Better',
        ctaLabel: 'Shop Now →',
        ctaUrl: '/shop?category=Home & Living',
        imageUrl: '/images/banners/armchair.png',
        themeBg: '#f7ece2',
        sortOrder: 2
      },
      {
        badgeLabel: 'Tech Essentials',
        title: 'Upgrade Your\nLifestyle',
        ctaLabel: 'Shop Now →',
        ctaUrl: '/shop?category=Electronics',
        imageUrl: '/images/banners/smartwatch.png',
        themeBg: '#e6edf5',
        sortOrder: 3
      }
    ]);

    await Review.create([
      {
        customerName: 'Sarah J.',
        avatarUrl: '/images/avatars/sarah.jpg',
        rating: 5,
        body: 'Amazing quality and fast delivery! Viva has become my go-to store for everything.',
        isVerified: true,
        sortOrder: 1
      },
      {
        customerName: 'Michael T.',
        avatarUrl: '/images/avatars/michael.jpg',
        rating: 5,
        body: 'Great prices, excellent customer service, and super easy returns. Highly recommend!',
        isVerified: true,
        sortOrder: 2
      },
      {
        customerName: 'Priya K.',
        avatarUrl: '/images/avatars/priya.jpg',
        rating: 5,
        body: 'I love the variety they offer. I can find everything in one place. So convenient!',
        isVerified: true,
        sortOrder: 3
      }
    ]);

    await Inquiry.create([
      {
        name: 'Emma Watson',
        email: 'emma.w@example.com',
        phone: '+1 (555) 234-5678',
        subject: 'Order Tracking & Delivery Inquiry',
        message: 'Hello, I placed order #VIVA-9824 and wanted to confirm if the package includes expedited delivery to Springfield. Thank you!',
        status: 'New',
        adminNotes: '',
        createdAt: new Date(now - 2 * 3600 * 1000)
      },
      {
        name: 'Liam Neeson',
        email: 'liam@example.com',
        phone: '+1 (555) 876-5432',
        subject: 'Product Restock Question (Noise Cancelling Headphones)',
        message: 'Hi team, do you know when the Obsidian Black color edition will be restocked? Looking to purchase 3 units for my team.',
        status: 'In Progress',
        adminNotes: 'Customer informed restock expected next Monday.',
        createdAt: new Date(now - 26 * 3600 * 1000)
      }
    ]);

    await NewsletterSubscriber.create([
      { email: 'alex@example.com', source: 'homepage-footer', subscribedAt: new Date() },
      { email: 'sarah.shopper@viva.com', source: 'deals-popup', subscribedAt: new Date(now - 48 * 3600 * 1000) }
    ]);

    console.log('🎉 Database successfully populated with realistic dynamic production data!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
