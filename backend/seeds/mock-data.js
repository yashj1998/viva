module.exports = {
  heroSlides: [
    {
      headline: 'Elevate Your Everyday',
      subcopy: 'Discover quality products across every category — made for the way you live.',
      ctaLabel: 'Shop Now →',
      ctaUrl: '#products',
      badgeText: 'SUMMER SALE · UP TO 40% OFF',
      imageUrl: '/images/hero-composite.png',
      bgColor: '#f3efe3',
      sortOrder: 1,
      isActive: true
    },
    {
      headline: 'Curated For Better Living',
      subcopy: 'Explore modern essentials designed to bring comfort, style, and everyday elegance.',
      ctaLabel: 'Explore Deals →',
      ctaUrl: '#deals',
      badgeText: 'WEEKLY HIGHLIGHTS · NEW PICKS',
      imageUrl: '/images/hero-composite.png',
      bgColor: '#eef1e6',
      sortOrder: 2,
      isActive: true
    }
  ],

  categories: [
    {
      name: 'Electronics',
      slug: 'electronics',
      iconClass: 'fa-solid fa-laptop',
      bgColor: '#e6edf5',
      iconColor: '#1e3a5f',
      sortOrder: 1,
      isFeatured: true
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      iconClass: 'fa-solid fa-shirt',
      bgColor: '#fce7e3',
      iconColor: '#83281d',
      sortOrder: 2,
      isFeatured: true
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      iconClass: 'fa-solid fa-house',
      bgColor: '#fef3c7',
      iconColor: '#854d0e',
      sortOrder: 3,
      isFeatured: true
    },
    {
      name: 'Beauty',
      slug: 'beauty',
      iconClass: 'fa-solid fa-bottle-droplet',
      bgColor: '#fbe8e6',
      iconColor: '#9d174d',
      sortOrder: 4,
      isFeatured: true
    },
    {
      name: 'Sports',
      slug: 'sports',
      iconClass: 'fa-solid fa-compass',
      bgColor: '#e0f2fe',
      iconColor: '#0369a1',
      sortOrder: 5,
      isFeatured: true
    },
    {
      name: 'Toys & Kids',
      slug: 'toys-kids',
      iconClass: 'fa-solid fa-shapes',
      bgColor: '#ffedd5',
      iconColor: '#c2410c',
      sortOrder: 6,
      isFeatured: true
    },
    {
      name: 'Books',
      slug: 'books',
      iconClass: 'fa-solid fa-book-open',
      bgColor: '#f3e8ff',
      iconColor: '#6b21a8',
      sortOrder: 7,
      isFeatured: true
    },
    {
      name: 'Pet Supplies',
      slug: 'pet-supplies',
      iconClass: 'fa-solid fa-paw',
      bgColor: '#e2e8f0',
      iconColor: '#334155',
      sortOrder: 8,
      isFeatured: true
    },
    {
      name: 'View All',
      slug: 'all',
      iconClass: 'fa-solid fa-border-all',
      bgColor: '#f1f5f9',
      iconColor: '#123524',
      sortOrder: 9,
      isFeatured: true
    }
  ],

  products: [
    {
      _id: 'prod_1',
      name: 'Noise Cancelling Headphones',
      slug: 'noise-cancelling-headphones',
      category: 'Electronics',
      price: 99.99,
      salePrice: 79.99,
      discountPercent: 20,
      ratingAvg: 4.9,
      ratingCount: 1234,
      primaryImageUrl: '/images/products/headphones.png',
      isTopPick: true,
      badgeText: 'HOT DEAL',
      sortOrder: 1,
      stockQuantity: 45
    },
    {
      _id: 'prod_2',
      name: 'Linen Casual Shirt',
      slug: 'linen-casual-shirt',
      category: 'Fashion',
      price: 39.99,
      salePrice: 29.99,
      discountPercent: 25,
      ratingAvg: 4.8,
      ratingCount: 812,
      primaryImageUrl: '/images/products/linen-shirt.png',
      isTopPick: true,
      badgeText: 'BESTSELLER',
      sortOrder: 2,
      stockQuantity: 60
    },
    {
      _id: 'prod_3',
      name: 'Minimalist Niacinamide Serum',
      slug: 'minimalist-niacinamide-serum',
      category: 'Beauty',
      price: 19.99,
      salePrice: 16.99,
      discountPercent: 15,
      ratingAvg: 4.9,
      ratingCount: 645,
      primaryImageUrl: '/images/products/serum.png',
      isTopPick: true,
      badgeText: 'STAFF PICK',
      sortOrder: 3,
      stockQuantity: 120
    },
    {
      _id: 'prod_4',
      name: 'Compact Coffee Maker',
      slug: 'compact-coffee-maker',
      category: 'Home & Living',
      price: 69.99,
      salePrice: 48.99,
      discountPercent: 30,
      ratingAvg: 4.7,
      ratingCount: 963,
      primaryImageUrl: '/images/products/coffee-maker.png',
      isTopPick: true,
      badgeText: 'POPULAR',
      sortOrder: 4,
      stockQuantity: 30
    },
    {
      _id: 'prod_5',
      name: 'Urban Travel Backpack',
      slug: 'urban-travel-backpack',
      category: 'Fashion',
      price: 49.99,
      salePrice: 39.99,
      discountPercent: 20,
      ratingAvg: 4.8,
      ratingCount: 1108,
      primaryImageUrl: '/images/products/backpack.png',
      isTopPick: true,
      badgeText: 'TRENDING',
      sortOrder: 5,
      stockQuantity: 75
    },
    {
      _id: 'prod_6',
      name: 'Ceramic Minimalist Table Lamp',
      slug: 'ceramic-minimalist-table-lamp',
      category: 'Home & Living',
      price: 54.99,
      salePrice: 42.99,
      discountPercent: 22,
      ratingAvg: 4.9,
      ratingCount: 420,
      primaryImageUrl: '/images/banners/armchair.png',
      isTopPick: false,
      badgeText: 'NEW',
      sortOrder: 6,
      stockQuantity: 25
    },
    {
      _id: 'prod_7',
      name: 'Smart Hybrid Fitness Watch',
      slug: 'smart-hybrid-fitness-watch',
      category: 'Electronics',
      price: 129.99,
      salePrice: 99.99,
      discountPercent: 23,
      ratingAvg: 4.8,
      ratingCount: 512,
      primaryImageUrl: '/images/banners/smartwatch.png',
      isTopPick: false,
      badgeText: 'PREMIUM',
      sortOrder: 7,
      stockQuantity: 40
    }
  ],

  promoBanners: [
    {
      badgeLabel: 'New Arrivals',
      title: 'Fresh Styles\nJust In',
      ctaLabel: 'Shop Now →',
      ctaUrl: '#new-arrivals',
      imageUrl: '/images/banners/handbag.png',
      themeBg: '#eef1e6',
      sortOrder: 1
    },
    {
      badgeLabel: 'Home Refresh',
      title: 'Make Your\nSpace Better',
      ctaLabel: 'Shop Now →',
      ctaUrl: '#home-refresh',
      imageUrl: '/images/banners/armchair.png',
      themeBg: '#f7ece2',
      sortOrder: 2
    },
    {
      badgeLabel: 'Tech Essentials',
      title: 'Upgrade Your\nLifestyle',
      ctaLabel: 'Shop Now →',
      ctaUrl: '#tech-essentials',
      imageUrl: '/images/banners/smartwatch.png',
      themeBg: '#e6edf5',
      sortOrder: 3
    }
  ],

  reviews: [
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
  ],

  topPicksSettings: {
    title: 'Top Picks For You',
    badge: '✨',
    subtitle: 'Handpicked deals and trending items tailored for modern living',
    seeAllText: 'See All Deals',
    seeAllUrl: '/shop',
    isActive: true,
    maxDisplayCount: 10
  },

  adminUsers: [
    {
      _id: 'usr_1',
      name: 'Yash Joshi (Super Admin)',
      email: 'admin@viva.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      avatarUrl: '/images/avatars/sarah.jpg',
      lastLogin: new Date()
    },
    {
      _id: 'usr_2',
      name: 'Elena Rostova',
      email: 'manager@viva.com',
      password: 'manager123',
      role: 'manager',
      status: 'active',
      avatarUrl: '/images/avatars/priya.jpg',
      lastLogin: new Date(Date.now() - 4 * 3600 * 1000)
    },
    {
      _id: 'usr_3',
      name: 'Marcus Vance',
      email: 'support@viva.com',
      password: 'support123',
      role: 'support',
      status: 'active',
      avatarUrl: '/images/avatars/michael.jpg',
      lastLogin: new Date(Date.now() - 24 * 3600 * 1000)
    }
  ],

  inquiries: [
    {
      _id: 'inq_1',
      name: 'Emma Watson',
      email: 'emma.w@example.com',
      phone: '+1 (555) 234-5678',
      subject: 'Order Tracking & Delivery Inquiry',
      message: 'Hello, I placed order #VIVA-9824 yesterday and wanted to confirm if the package includes expedited delivery to Springfield. Thank you!',
      status: 'New',
      adminNotes: '',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000)
    },
    {
      _id: 'inq_2',
      name: 'Liam Neeson',
      email: 'liam@example.com',
      phone: '+1 (555) 876-5432',
      subject: 'Product Restock Question (Noise Cancelling Headphones)',
      message: 'Hi team, do you know when the Obsidian Black color edition will be restocked? Looking to purchase 3 units for my team.',
      status: 'In Progress',
      adminNotes: 'Customer informed restock expected next Monday.',
      createdAt: new Date(Date.now() - 26 * 3600 * 1000)
    },
    {
      _id: 'inq_3',
      name: 'Chloe Bennett',
      email: 'chloe@example.com',
      phone: '+1 (555) 345-6789',
      subject: 'Corporate Gift Inquiry',
      message: 'Interested in placing a bulk order of 25 Urban Travel Backpacks with custom corporate branding.',
      status: 'Resolved',
      adminNotes: 'Corporate quote sent via email.',
      createdAt: new Date(Date.now() - 72 * 3600 * 1000)
    }
  ],

  siteSettings: {
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
    googleAnalyticsId: 'G-VIVA2026STORE',
    socialFacebook: 'https://facebook.com/viva.living',
    socialInstagram: 'https://instagram.com/viva.living',
    socialTwitter: 'https://x.com/viva_living'
  },

  auditLogs: [
    {
      _id: 'log_1',
      userEmail: 'admin@viva.com',
      userRole: 'admin',
      action: 'UPDATE_SETTINGS',
      module: 'Settings',
      details: 'Updated global store announcement bar message and free shipping threshold',
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      _id: 'log_2',
      userEmail: 'manager@viva.com',
      userRole: 'manager',
      action: 'UPDATE_PRODUCT',
      module: 'Products',
      details: 'Updated pricing and stock quantity for Sony Ultra ANC Headphones Pro',
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      _id: 'log_3',
      userEmail: 'support@viva.com',
      userRole: 'support',
      action: 'UPDATE_ORDER_STATUS',
      module: 'Orders',
      details: 'Marked order #VIVA-9824 as Shipped with tracking code TRK-9824US',
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 90 * 60 * 1000)
    }
  ],

  customers: [
    {
      _id: 'cust_1',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      passwordHash: '698a3fee9b5b653840de66ea6a61c0009b7f0032ddf633afbf9f543778e8df67cf72c1cd3a8c6aaa9f0d8aa5f2f908dafe55b0d5d35606826bcdd55fcdd0380d',
      salt: '4db59e62dd7c62aa782240dae155237e',
      phone: '+1 (555) 234-5678',
      avatarUrl: '/images/avatars/sarah.jpg',
      addresses: [
        {
          _id: 'addr_1',
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          zip: '97477',
          country: 'United States',
          isDefault: true
        }
      ],
      status: 'active',
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000),
      lastLogin: new Date()
    },
    {
      _id: 'cust_2',
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      passwordHash: '1372a4f84df56d7440cd300aaf02129a5b04073d2b67da91c27cabff8bddd994ae0d1b89352315a16367be9a3d70c438853a1c9d7ffdd5c60a40e2f92573fdfa',
      salt: '93959e995804cdb62272747f5431249b',
      phone: '+1 (555) 876-5432',
      avatarUrl: '/images/avatars/priya.jpg',
      addresses: [
        {
          _id: 'addr_2',
          street: '120 Pike St',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          country: 'United States',
          isDefault: true
        }
      ],
      status: 'active',
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000),
      lastLogin: new Date()
    }
  ]
};


