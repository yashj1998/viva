# Build Playbook — ViVA (Live Better) Homepage

Companion to `PRD.md`, `TRD.md`, and `design-system.md`. Follow in order.

## 1. Prerequisites
- Existing PHP project structure to build into (this homepage assumes it's joining an existing PHP/jQuery/Tailwind codebase per project convention — confirm folder layout before starting).
- MySQL database access (or confirm existing DB connection details if this is joining an existing project).
- Tailwind CLI or existing build pipeline for compiling/purging CSS for production (Tailwind CDN is fine for local prototyping only).
- Node/npm only if the project already uses it to run the Tailwind build — not required for PHP itself.

## 2. Project Setup
- Confirm/create the partial structure: `/partials/header.php`, `/partials/footer.php`, `/partials/hero-carousel.php`, `/partials/category-strip.php`, `/partials/product-carousel.php`, `/partials/product-card.php`, `/partials/promo-banner-row.php`, `/partials/testimonial-carousel.php`, `/partials/newsletter-signup.php`, `/partials/trust-strip.php`.
- Add the design tokens from `design-system.md` §2–3 into `tailwind.config.js` (or the CSS `:root` custom properties, matching whatever the existing project already uses) — `green-950/900/800/600/500`, `cream`, `sage-100`, `peach-100`, `blue-100`, `coral`, `pink-badge`.
- Register Poppins + Inter (Google Fonts) and Font Awesome in the shared `<head>`/`header.php`.
- Confirm DB tables exist (or create migrations) for `Product`, `Category`, `PromoBanner`, `HeroSlide`, `Review`, `NewsletterSubscriber` per `TRD.md` §3.

## 3. Build Order
1. **Global layout & tokens** — `header.php` (utility bar, logo/search/icons, nav) and `footer.php`, wired with Tailwind tokens and fonts. Get the shared shell right first since every other section sits inside it.
2. **Static sections in visual order** — build top-down, matching the reference:
   - Hero carousel (`hero-carousel.php`) — start with static markup for one slide, then wire Swiper.
   - Category strip (`category-strip.php`) — static icon grid first, then loop from `Category` table.
   - Top Picks product carousel (`product-carousel.php` + `product-card.php`) — build the single product-card component first, confirm it matches `design-system.md` §5, then wrap in Swiper and loop real `Product` data.
   - Promo banner row (`promo-banner-row.php`) — 3-up static, then data-driven from `PromoBanner`.
3. **Social proof & conversion sections** — testimonial carousel (`testimonial-carousel.php`, Swiper) and newsletter signup (`newsletter-signup.php`, with jQuery AJAX submit + server-side PHP validation/storage).
4. **Trust strip** (`trust-strip.php`) — static, no data dependency.
5. **Interactive polish** — wire up cart/wishlist count badges in the header to reflect real session/DB state; confirm Swiper configs match the responsive behavior described in `design-system.md` §5 (mobile peek on product carousel, dot+arrow nav on hero, 1-up→3-up on reviews).
6. **Performance pass** — add `loading="lazy"` to all below-the-fold images, confirm hero image is eager-loaded, purge/minify Tailwind for production.
7. **QA pass** — see checklist below.
8. **Deployment** — per existing project pipeline.

## 4. Page-by-Page Build Notes
Since this PRD covers a single homepage, notes are organized by section instead:

- **Header/Nav**: reuse across every future page, not just the homepage — build it as a true shared partial from day one so category/product pages inherit it later.
- **Hero carousel**: only the first slide has real copy in the reference; write real copy for any additional slides before shipping (flagged as content gap in `PRD.md` §7). Keep the sale badge as a separate absolutely-positioned element so its copy can change independently of the slide background.
- **Top Picks carousel**: this component should be written generically enough (`product-carousel.php` accepting a product query/array) to reuse later for "Related Products" or "Recently Viewed" — don't hardcode it to only the homepage's specific query.
- **Promo banner row**: each banner's theme (sage/peach/blue) is just a background-color swap on the same card component — build one component, vary the class, not three separate markup blocks.
- **Testimonials**: sample review data should be replaced with real customer reviews before launch; keep the verified-badge logic tied to an actual `is_verified` flag, not hardcoded true.
- **Newsletter**: confirm with the team whether an ESP integration (Mailchimp/SendGrid) is in scope for v1 or if DB-only capture is enough for now (open question in `TRD.md` §9) before building the submit handler.

## 5. Testing & QA Checklist
- **Responsive breakpoints**: check at ~375px (mobile), ~640px (`sm`), ~1024px (`lg`), and a wide desktop width — confirm nav scroll behavior, category grid column count, product-carousel peek, and promo-banner stacking all match `design-system.md` §4.
- **Key flows to click through**: search submit, category icon click, product card add-to-cart (badge count updates in header), promo banner CTA, newsletter submit (success + validation-error states), hero carousel autoplay + manual arrow/dot nav.
- **Accessibility**: keyboard-only pass through all three carousels and the newsletter form; screen-reader pass on discount badges/price strike-through (confirm sale info isn't color-only); check `prefers-reduced-motion` pauses hero autoplay.
- **Cross-browser**: confirm Swiper carousels behave consistently in the project's supported browser matrix (Safari touch/swipe behavior is worth double-checking specifically).
- **Performance**: Lighthouse pass on the homepage — check image lazy-loading is actually deferring requests, and that Tailwind output is purged (not shipping the full utility set).

## 6. Deployment Steps
- Set any required environment variables/config (DB credentials, ESP API key if applicable, analytics ID) per the existing project's deployment convention.
- Run the production Tailwind build (purge unused classes) before deploy.
- Deploy via the existing project's current method (confirm in `TRD.md` §7 once known).
- Post-deploy checks: newsletter form actually stores/sends, all carousel images load (no broken image icons), cart/wishlist counts reflect real session state, category/CTA links resolve (even if placeholder pages for now).

## 7. Future Enhancements
- Category listing pages, product detail pages, cart/checkout flow, account dashboard, order tracking (all explicitly out of scope in `PRD.md` §4).
- A lightweight CMS/admin for managing hero slides, promo banners, and featured "Top Picks" without a code deploy.
- Full "All Categories" mega-menu if the simple dropdown proves insufficient.
- Multi-language/multi-currency support if the store expands beyond a single locale.
