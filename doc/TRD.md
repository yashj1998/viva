# TRD — ViVA (Live Better) Multi-Category E-Commerce Site

## Stack (per project convention)
- **Frontend**: Server-rendered PHP templates/partials + Tailwind CSS utility classes
- **Interactivity**: jQuery for DOM/event wiring, Swiper.js for the hero carousel, the Top Picks product carousel, and the testimonial carousel
- **Backend**: PHP (page controllers/includes rendering the homepage sections; no framework assumed unless one is already in use elsewhere in the project)
- **Database**: MySQL (assumed, for products/categories/reviews/newsletter signups) — confirm against existing project schema if this homepage is joining an existing codebase
- **Hosting**: Standard LAMP/LEMP-style hosting (Apache/Nginx + PHP-FPM), consistent with existing PHP projects

## 1. Architecture Overview
- Classic multi-page PHP app: each route is a PHP entry point that includes shared `header.php` / `footer.php` partials and section partials (`hero.php`, `top-picks.php`, `testimonials.php`, etc.).
- Homepage is server-rendered on request; product/review data is pulled from the database and looped into markup server-side, then Swiper/jQuery progressively enhance the carousels client-side after DOM ready.
- No client-side routing/SPA behavior — this matches the existing PHP/jQuery/Tailwind convention already used elsewhere in the project (mobile tab nav, marquee components, etc.).
- Rendering strategy: fully server-rendered HTML per request (no SSR/CSR split to manage); acceptable given the content is not highly personalized on this page.

## 2. Tech Stack
- **Templating**: PHP includes/partials (no templating engine assumed unless the existing project already uses one — reuse it if so)
- **Styling**: Tailwind CSS (CDN for prototyping; compiled/purged Tailwind build for production, matching however the rest of the project currently builds CSS)
- **JS libraries**: jQuery (event handling, form submission), Swiper.js (hero slider, product carousel, review carousel), Font Awesome (iconography) — no heavier JS framework needed
- **Database & access**: MySQL via PDO (or the existing project's current DB access layer — reuse it, don't introduce a second one)
- **Auth**: Reuse existing account/session system for Account/Wishlist/Cart icon states (logged-in vs. guest); do not build a parallel auth system for this homepage
- **Hosting/CI-CD**: Whatever the existing project already deploys to (match current convention rather than introducing a new pipeline)

## 3. Data Model
Core entities implied by the homepage:

- **Product**
  - id, name, slug, price, sale_price, discount_percent, rating_avg, rating_count, primary_image_url, category_id, is_top_pick (bool), created_at
- **Category**
  - id, name, slug, icon (icon class or image path), sort_order, is_featured (bool, drives category strip)
- **PromoBanner**
  - id, title, subtitle, image_url, link_url, theme (color variant), sort_order, active_from/active_to
- **HeroSlide**
  - id, headline, subcopy, cta_label, cta_url, image_url, badge_text (e.g., "Summer Sale · Up to 40% Off"), sort_order, active_from/active_to
- **Review**
  - id, customer_name, avatar_url, rating (1–5), body, is_verified (bool), sort_order
- **NewsletterSubscriber**
  - id, email, subscribed_at, source (e.g., "homepage-footer")
- **Cart / Wishlist** (counts only, on this page)
  - reuse existing cart/wishlist tables; homepage only needs an item count per session/user

Relationships: Product belongs to Category; HeroSlide/PromoBanner/Review are independent content entities managed for the homepage only; NewsletterSubscriber is standalone.

## 4. Key Integrations
- **Newsletter**: form posts to a PHP endpoint that validates + stores the email (and optionally forwards to an ESP like Mailchimp/SendGrid — flagged as an open question in the PRD).
- **Images**: served from existing project asset pipeline/CDN; product images should support responsive `srcset` sizes.
- **Analytics**: standard pageview/event tracking (e.g., GA4) on CTA clicks (Shop Now, See All Deals, Subscribe) — confirm which analytics tool the rest of the project uses.
- **Icons**: Font Awesome via CDN (or self-hosted subset if the project already bundles its own icon set).

## 5. Component Architecture
Reusable partials/components implied by the PRD:
- `header.php` — utility bar + logo/search/account-wishlist-cart + primary nav (shared across all pages)
- `hero-carousel.php` — Swiper-powered slide component, data-driven from `HeroSlide`
- `category-strip.php` — icon grid, data-driven from `Category` (featured only)
- `product-carousel.php` — reusable Swiper product-card carousel, driven by a product query (used for Top Picks; reusable later for "Related Products," "Recently Viewed," etc.)
- `product-card.php` — single card partial (image, discount badge, name, rating, price/strike-price, add-to-cart button) — used inside `product-carousel.php`
- `promo-banner-row.php` — 3-up themed banner grid, data-driven from `PromoBanner`
- `testimonial-carousel.php` — Swiper-powered review cards, data-driven from `Review`
- `newsletter-signup.php` — form + client-side validation + AJAX (jQuery) submit
- `trust-strip.php` — static icon row (shipping/returns/payments/support)
- `footer.php` — link columns + app badges + social + legal (shared across all pages)

Shared patterns: all carousels use one shared Swiper init pattern (config object per instance) and one shared jQuery module for cart/wishlist count updates so the header badge stays in sync after an add-to-cart action anywhere on the page.

## 6. Performance & SEO
- Lazy-load (`loading="lazy"`) all below-the-fold images (Top Picks, promo banners, reviews); hero image(s) load eager since they're above the fold.
- Serve responsive image sizes for product cards vs. hero imagery (hero needs a larger source).
- Minify/purge Tailwind for production so only used utility classes ship.
- Defer non-critical JS (Swiper init, jQuery) until after critical content paints.
- Single `<h1>` in the hero; category/product names as `<h2>`/`<h3>` where appropriate; descriptive `alt` text pulled from `Product.name` / `Category.name`.
- Basic meta tags (title, description, OG image) on the homepage entry point; sitemap entry included.

## 7. Environments & Deployment
- Local/dev/staging/production environments consistent with the existing PHP project's current setup.
- Environment variables (or a config file, per current project convention) for DB credentials, ESP API key (if newsletter integration is added), analytics ID.
- Deploy via whatever mechanism the existing project already uses (FTP/SSH deploy, CI pipeline, etc.) — this homepage should not require a new deployment method.

## 8. Security & Compliance
- Server-side validation on the newsletter email field (not just client-side jQuery validation) to prevent junk submissions.
- Basic rate-limiting/honeypot on the newsletter form to deter spam bots.
- Escape all dynamic content (product names, review bodies) on output to prevent XSS, since reviews in particular are user-generated.
- Reuse existing session/auth security posture for the Account/Wishlist/Cart state — no new auth surface introduced by this page.
- Privacy note already surfaced in the UI ("We respect your privacy") should correspond to an actual privacy policy page linked from the footer.

## 9. Open Technical Questions
- Does the existing project already have a DB access layer / ORM to reuse, or does this homepage introduce the first one?
- Is there an existing image CDN/optimization pipeline, or do product images need one set up?
- Confirm whether "Deals" and category links route to pages that already exist in the project or need to be scoped separately.
