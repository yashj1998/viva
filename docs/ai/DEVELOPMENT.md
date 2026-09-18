# ViVA (Live Better) — Engineering & Development Standards

## 1. Technical Architecture

ViVA follows a modular, server-rendered **Node.js (Express + EJS partials)** architecture paired with modern utility CSS (Tailwind) and lightweight progressive enhancement (jQuery + Swiper.js):

```text
d:\classes\e-commerce\
├── server.js                 # Root proxy entry point
├── package.json              # Dependencies & npm scripts ("start", "dev", "seed")
├── .env                      # Environment variables (PORT, MONGODB_URI)
├── backend/                  # Backend MVC layer
│   ├── server.js             # Express application & routes mounting
│   ├── config/
│   │   └── db.js             # Database connector with DNS resolution & retry
│   ├── controllers/
│   │   ├── homeController.js
│   │   ├── shopController.js
│   │   ├── pageController.js
│   │   └── cartController.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── HeroSlide.js
│   │   ├── PromoBanner.js
│   │   ├── Review.js
│   │   ├── Order.js
│   │   └── NewsletterSubscriber.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── shopRoutes.js
│   │   ├── pageRoutes.js
│   │   ├── cartRoutes.js
│   │   └── api.js
│   └── seeds/
│       ├── seed.js           # Atlas / MongoDB database seeder
│       └── mock-data.js      # Seed catalog fallback dataset
└── frontend/                 # Frontend presentation layer
    ├── public/               # Static assets
    │   ├── css/style.css     # ViVA design tokens & animations
    │   ├── js/main.js        # Swiper inits & badge updates
    │   ├── js/newsletter.js  # AJAX subscription
    │   └── images/           # Studio product cutouts & hero imagery
    └── views/                # EJS templates
        ├── index.ejs         # Homepage
        ├── pages/            # Shop, PDP, Deals, Brands, Cart, Checkout, etc.
        └── partials/         # Modular components (header, nav, footer, etc.)
```

---

## 2. Dependencies & Asset Pipelines

- **Express.js (v4+)**: High-performance HTTP routing, static asset serving, and middleware.
- **EJS (v3+)**: Clean, lightweight templating for server-rendered HTML partials with zero client build overhead.
- **Mongoose (v8+)**: Elegant MongoDB object modeling with schema validation, indexes, and queries.
- **Tailwind CSS**: Utility-first styling configured with ViVA theme tokens.
- **Swiper.js (v11)**: Loaded via CDN or vendor bundle for touch/drag carousels with zero layout shifts.
- **jQuery (v3.7+)**: Loaded for lightweight DOM event delegation, dynamic badge counters, and AJAX handlers.
- **Font Awesome (v6)**: Vector icons for header, trust badges, star ratings, and shopping actions.
- **Google Fonts**: `Poppins` (600/700/800) and `Inter` (400/500/600).

---

## 3. Coding Guidelines & Best Practices

### Express & Server-Side Rendering
- Render all initial HTML server-side inside `views/index.ejs` using EJS includes (`<%- include('partials/header') %>`).
- Handle database errors gracefully: if MongoDB is connecting or unavailable, seamlessly render with local mock fallback data so the storefront never crashes.
- Ensure components are modular: `product-card.ejs` must accept a `product` object so it can be reused across Top Picks, Deals, Related Products, and Category pages.

### Frontend & JavaScript Interactivity
- Separate concerns: keep Swiper configurations in structured objects inside `public/js/main.js`.
- Provide real interactive feedback:
  - Clicking quick add-to-cart sends `POST /api/cart/add`, increments the header cart badge (`Cart: 2 → 3`) with a subtle pulse animation.
  - Clicking wishlist increments the header wishlist badge with active heart state.
  - Newsletter submission posts to `/api/newsletter` with instant inline feedback.

### Performance & Asset Delivery
- Eager load above-the-fold assets (hero imagery, logo).
- Apply `loading="lazy"` and `decoding="async"` to all below-the-fold product images, banners, and customer avatars.
- Avoid large uncompressed images; optimize SVGs and WebP/JPG product cutouts.

### Accessibility & Semantics (WCAG AA)
- Single `<h1>` tag inside the hero carousel.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- Descriptive `aria-label` tags on all icon-only buttons (search, cart, wishlist, carousel arrows).
- Color contrast ratio of 4.5:1 minimum maintained on all body text and buttons.
- Visible focus rings (`focus:ring-2 focus:ring-[#3e8a5f]`) on interactive elements.
