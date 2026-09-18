# ViVA E-Commerce — Global AI Agent Rules

Welcome to the **ViVA (Live Better)** multi-category e-commerce storefront project.

All AI agents, engineers, and contributors operating in this repository must strictly adhere to these instructions.

---

## 1. Project Overview

ViVA is a modern, general multi-category e-commerce platform ("Live Better" tagline) offering premium and everyday products across Electronics, Fashion, Home & Living, Beauty, Sports, Toys & Kids, Books, and Pet Supplies. 

The primary surface is the high-converting, deal-forward, responsive homepage and shared shopping shell (utility bar, header, navigation, and footer) modeled with pixel precision after the reference design: `doc/Smart Shopping For Modern Living.jpg`.

---

## 2. Core Documentation Hierarchy & Source of Truth

Before proposing or making any architectural, design, or code changes, you **MUST** read and respect the project AI documentation in this strict priority order:

1. `AGENTS.md` (This file — Global Entry & Directives)
2. `docs/ai/PROJECT.md` (Product Vision, Domain, Features, Data Models)
3. `docs/ai/DESIGN-SYSTEM.md` (Visual Standards, Color Tokens, Typography, Components)
4. `docs/ai/DEVELOPMENT.md` (Engineering Standards, PHP/Tailwind/Swiper Architecture)
5. `docs/ai/WORKFLOW.md` (Step-by-step Development & Verification Workflow)
6. Raw reference documents in `doc/` (`PRD.md`, `TRD.md`, `design-system.md`, `skill.md`, `Smart Shopping For Modern Living.jpg`)
7. Existing codebase

---

## 3. Technology Stack & Architectural Constraints

- **Backend / Server**: Node.js & Express.js server-rendered application using modular **EJS partials/components** (modular layout inside `views/partials/`).
- **Styling**: Tailwind CSS utility classes configured with custom ViVA design tokens (Poppins + Inter fonts, bespoke forest green palette `#123524`, cream backgrounds `#f3efe3`, pill shapes).
- **Interactivity**: 
  - **Swiper.js v11** for responsive carousels (Hero, Top Picks product cards, Testimonial cards).
  - **jQuery / Vanilla JS** for DOM manipulation, AJAX newsletter submission, and real-time cart/wishlist badge synchronization.
- **Icons**: Font Awesome 6 and crisp semantic SVG iconography inside tinted circular badges.
- **Data Persistence**: **MongoDB with Mongoose ODM**, modeling `Product`, `Category`, `PromoBanner`, `HeroSlide`, `Review`, and `NewsletterSubscriber`. Includes mock seed fallback for offline/development mode.

---

## 4. Fundamental Rules for Agents

### Rule 1: Understand Before Coding
Never write or modify code without inspecting existing files, understanding the requirements, and reviewing the reference design (`doc/Smart Shopping For Modern Living.jpg`).

### Rule 2: Design-First & Light Theme Default
The design system enforces a **Light Theme Default** (`#ffffff` surfaces, `#f3efe3` cream hero container, soft pastel banner tints `#eef1e6`, `#f7ece2`, `#e6edf5`). Do not introduce dark mode unless explicitly asked. Match typography, spacing, pill radius, badges, and colors with extreme fidelity.

### Rule 3: Component Reuse & DRY Architecture
Always check existing partials and utilities before creating new components:
- `header.php`: Global utility bar, search input, account/wishlist/cart counters, category mega-menu trigger, main nav links.
- `hero-carousel.php`: Swiper hero banner with discount tag, headline, subcopy, and product composite.
- `category-strip.php`: 9 featured category circular badges with responsive overflow.
- `product-carousel.php` & `product-card.php`: Reusable deal cards with percentage badges, star ratings, strike-through pricing, and quick-add buttons.
- `promo-banner-row.php`: 3-column category promo cards with custom color themes.
- `testimonial-carousel.php`: Social proof review slider with verified purchase badges.
- `newsletter-signup.php`: Forest green CTA banner with client + server validated email capture.
- `trust-strip.php`: 4-pillar trust badge row.
- `footer.php`: Global sitemap, app download badges, and copyright/legal links.

### Rule 4: Zero Placeholders & Production Quality
- No fake buttons that do nothing.
- No broken links or unhandled states.
- Clean semantic HTML5, accessible ARIA attributes, keyboard navigation for carousels, and responsive layouts tested across mobile (`375px`), tablet (`768px`), and desktop (`1280px+`).
