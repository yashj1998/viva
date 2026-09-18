# ViVA (Live Better) — Project Specifications

## 1. Product Vision & Value Proposition

**ViVA** ("Live Better") is a modern, high-converting multi-category e-commerce platform designed to offer a seamless, trustworthy, and visually captivating shopping experience across diverse consumer categories:
- **Electronics**
- **Fashion**
- **Home & Living**
- **Beauty**
- **Sports**
- **Toys & Kids**
- **Books**
- **Pet Supplies**

The storefront is engineered to convert first-time visitors into confident buyers through clear trust signals, deal-forward hierarchy (discount badges, before/after pricing), intuitive category discovery, and frictionless micro-interactions.

---

## 2. Target Audience & Personas

1. **Value & Deal Hunters**: Shoppers looking for high-quality everyday essentials with transparent discounts, promo banners, and instant savings indicators.
2. **Multi-Category Browsers**: Users seeking a curated one-stop shop where they can purchase tech accessories, home decor, and personal care in a single checkout.
3. **Mobile-First Consumers**: Shoppers accessing the storefront on smartphones requiring fast loading times, horizontally scrollable category chips, tap-friendly add-to-cart controls, and sticky utility navigation.

---

## 3. Scope & Key Functional Sections

Derived directly from the reference design (`doc/Smart Shopping For Modern Living.jpg`) and `doc/PRD.md`:

| Section | Component Name | Description & Key Features | Primary User Action |
|---|---|---|---|
| **Utility Trust Bar** | `utility-bar.php` | Dark forest green bar with Free Shipping on $49+, 30-day easy returns, and secure payment messaging. | Trust verification |
| **Global Header** | `header.php` | Wordmark logo ("ViVA Live Better"), rounded search bar with search button, Account, Wishlist (badge counter), and Cart (badge counter). | Search, view cart/wishlist |
| **Primary Navigation** | `nav-bar.php` | Pill button ("All Categories" with hamburger icon), links: Home, Shop, Deals, New Arrivals, Brands, Inspiration, Track Order. | Section/category navigation |
| **Hero Carousel** | `hero-carousel.php` | Soft cream card (`#f3efe3`), headline ("Elevate Your Everyday"), subcopy, "Shop Now →" CTA, trust pills (Premium Quality, Great Prices, 10K+ Customers), product lifestyle visual, "SUMMER SALE UP TO 40% OFF" badge, and pagination dots. | Click primary hero CTA |
| **Category Strip** | `category-strip.php` | 9 circular pastel-tinted category icons: Electronics, Fashion, Home & Living, Beauty, Sports, Toys & Kids, Books, Pet Supplies, and View All. | Filter / browse category |
| **Top Picks Deals** | `product-carousel.php` | Horizontal Swiper carousel of discounted products: -% badge, product photo, title, star rating + count, sale & strike price, quick Add-to-Cart button, and carousel arrow controls. | Quick add to cart, deal inspection |
| **Promo Banners** | `promo-banner-row.php` | 3 curated collection cards: "Fresh Styles Just In" (Sage), "Make Your Space Better" (Peach), "Upgrade Your Lifestyle" (Ice Blue). | Explore curated collections |
| **Social Proof / Reviews** | `testimonial-carousel.php` | "Loved By Thousands ❤️" section featuring aggregate 4.8/5 rating, customer avatars, verified buyer badges, and real customer review quotes. | Read customer feedback |
| **Newsletter Capture** | `newsletter-signup.php` | Dark forest green banner (`rounded-3xl`): "Stay in the Loop", email input + green Subscribe button, and privacy disclaimer. | Subscribe to newsletter |
| **Trust Strip** | `trust-strip.php` | 4 value propositions: Free Shipping ($49+), Easy Returns (30 days), Secure Payments (100% secure), 24/7 Support. | Reassure purchase confidence |
| **Global Footer** | `footer.php` | Deep green footer with brand mission, social links, multi-column sitemaps (Shop, Customer Service, Company), App Store & Google Play badges, copyright, and legal policies. | Access policies, app download |

---

## 4. Data Models & Mongoose Schemas
 
 ### 1. `Product` (`models/Product.js`)
 - `name` (String, required, trim)
 - `slug` (String, unique, index)
 - `category` (ObjectId ref: 'Category' or Category Slug)
 - `price` (Number, required)
 - `salePrice` (Number, required)
 - `discountPercent` (Number, calculated or specified)
 - `ratingAvg` (Number, default 4.8)
 - `ratingCount` (Number, default 0)
 - `primaryImageUrl` (String, required)
 - `isTopPick` (Boolean, default true, index)
 - `stockQuantity` (Number, default 50)
 - `createdAt` (Date, default Date.now)
 
 ### 2. `Category` (`models/Category.js`)
 - `name` (String, required)
 - `slug` (String, unique, index)
 - `iconClass` / `iconSvg` (String)
 - `bgColor` (String — e.g., `#e6edf5`, `#f7ece2`)
 - `sortOrder` (Number, default 0)
 - `isFeatured` (Boolean, default true)
 
 ### 3. `HeroSlide` (`models/HeroSlide.js`)
 - `headline` (String, default "Elevate Your Everyday")
 - `subcopy` (String)
 - `ctaLabel` (String, default "Shop Now →")
 - `ctaUrl` (String, default "/shop")
 - `imageUrl` (String)
 - `badgeText` (String, default "SUMMER SALE · UP TO 40% OFF")
 - `bgColor` (String, default "#f3efe3")
 - `sortOrder` (Number, default 0)
 - `isActive` (Boolean, default true)
 
 ### 4. `PromoBanner` (`models/PromoBanner.js`)
 - `badgeLabel` (String — "New Arrivals", "Home Refresh", "Tech Essentials")
 - `title` (String)
 - `ctaLabel` (String, default "Shop Now →")
 - `ctaUrl` (String)
 - `imageUrl` (String)
 - `themeBg` (String — `sage-100`, `peach-100`, `blue-100`)
 - `sortOrder` (Number, default 0)
 
 ### 5. `Review` (`models/Review.js`)
 - `customerName` (String, required)
 - `avatarUrl` (String)
 - `rating` (Number, min 1, max 5, default 5)
 - `body` (String, required)
 - `isVerified` (Boolean, default true)
 - `sortOrder` (Number, default 0)
 
 ### 6. `NewsletterSubscriber` (`models/NewsletterSubscriber.js`)
 - `email` (String, required, unique, trim, lowercase)
 - `source` (String, default "homepage-footer")
 - `subscribedAt` (Date, default Date.now)
 
 ### 7. `CartSession` & `WishlistSession`
 - Dynamic session-based storage (`req.session.cart`, `req.session.wishlist`), maintaining real-time badge counts (`3` wishlist items, `2` cart items) with AJAX add/remove endpoints.
