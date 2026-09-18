# PRD — ViVA (Live Better) Multi-Category E-Commerce Site

## 1. Overview
ViVA is a general multi-category e-commerce storefront ("Live Better" tagline) selling products across Electronics, Fashion, Home & Living, Beauty, Sports, Toys & Kids, Books, and Pet Supplies. This PRD covers the homepage and the shared shopping shell (header, nav, footer) derived from the reference homepage screenshot, which is the primary landing and discovery surface for the store.

## 2. Goals & Success Metrics
- Drive product discovery from a single homepage across many unrelated categories without feeling cluttered.
- Convert homepage visitors into product-page clicks and cart adds (via Top Picks deals, promo banners).
- Build trust quickly for first-time visitors (reviews, guarantees, secure-payment messaging) since it's a general marketplace rather than a single-brand store.
- Grow the email list via the newsletter signup for repeat-visit marketing.
- Qualitative success: a first-time visitor can find a relevant category or deal within one scroll of landing.

## 3. Target Audience
- General online shoppers comparison-shopping across everyday categories (electronics, fashion, home goods, beauty, etc.) rather than a niche audience.
- Price/deal-sensitive shoppers — discount badges and "before/after" pricing are a primary hook.
- Repeat customers who use "Track Order," "Wishlist," and "Account" regularly.
- Mobile-first browsers (the layout in the reference is responsive down to a narrow viewport with a horizontally scrollable nav).

## 4. Scope

### In Scope
- **Utility bar**: shipping/returns/payment trust messaging.
- **Header**: logo, search bar, account/wishlist/cart icons with cart/wishlist counts.
- **Primary nav**: "All Categories" mega-menu trigger + Home/Shop/Deals/New Arrivals/Brands/Inspiration/Track Order links.
- **Hero carousel**: rotating promotional slides (e.g., seasonal sale) with headline, subcopy, CTA, and a supporting product/lifestyle image.
- **Category strip**: icon + label grid for top-level categories, plus a "View All" entry.
- **Top Picks / Deals carousel**: horizontally scrollable product cards with discount badge, rating, price (strike-through original + sale price), and quick add-to-cart.
- **Promo banner row**: 3 themed banners (e.g., New Arrivals, Home Refresh, Tech Essentials) linking into category/collection pages.
- **Social proof section**: aggregate rating + rotating customer review cards.
- **Newsletter signup**: email capture with privacy note.
- **Trust strip**: shipping/returns/payments/support icons repeated near the footer.
- **Footer**: sitemap-style link columns (Shop, Customer Service, Company), app store badges, social links, legal links.

### Out of Scope (this version)
- Product detail pages, cart/checkout flow, account dashboard, order tracking logic.
- Category listing / search results pages.
- Payment processing integration.
- CMS/admin for managing homepage content (assumed hardcoded or simple include-based for v1, per current PHP stack).

## 5. Page-by-Page Requirements

| Page/Section | Purpose | Key Content/Features | Primary User Action |
|---|---|---|---|
| Homepage | Entry point & discovery hub | Hero carousel, categories, top picks, promo banners, reviews, newsletter | Click into a category, deal, or product |
| Header/Nav (global) | Navigation + account access | Search, account, wishlist, cart, category menu | Search or navigate to a section |
| Footer (global) | Secondary navigation + trust | Sitemap links, app badges, legal links | Find policy/support info |

## 6. User Flows
- **Deal discovery**: Land on homepage → scroll to "Top Picks For You" → scan discount badges → click a product card → (out of scope: product detail page).
- **Category browse**: Land on homepage → click a category icon or "All Categories" → (out of scope: category listing page).
- **Newsletter opt-in**: Land on homepage → scroll to "Stay in the Loop" → enter email → submit → confirmation state.
- **Search**: Use header search bar from any page → (out of scope: search results page).

## 7. Content & Assets Needed
- Product photography for each Top Picks item (currently placeholder/stock imagery in the build).
- Real copywriting for hero slide(s) beyond the first (a second slide currently uses placeholder copy).
- Customer review photos, names, and verified-purchase copy (currently sample data).
- Category icon set (currently Font Awesome icons standing in for a custom icon set).
- Logo asset (currently a placeholder bag icon + wordmark).
- App Store / Google Play badge artwork (official assets, not text placeholders).

## 8. Non-Functional Requirements
- **Performance**: Homepage should load fast despite multiple carousels — lazy-load below-the-fold product images.
- **Responsiveness**: Must degrade gracefully to mobile (nav becomes horizontally scrollable, category grid reflows, hero stacks vertically, product carousel shows partial next card as a scroll affordance).
- **Accessibility**: Carousel controls keyboard-operable, sufficient color contrast against the dark-green brand color, alt text on all product/category imagery, visible focus states on interactive elements.
- **SEO**: Homepage should have proper heading hierarchy (single H1 in hero), descriptive product/category alt text, and semantic landmarks (header/nav/main/footer).

## 9. Open Questions
- Is a full mega-menu needed behind "All Categories," or is it a simple dropdown list? (Reference screenshot doesn't show it expanded.)
- Does "Deals" get its own dedicated page/template, or reuse the category listing template with a filter?
- Is the newsletter form wired to a real ESP (Mailchimp, etc.) or just captured to the database for v1?
- Multi-currency / multi-language support needed, or single locale for now?
