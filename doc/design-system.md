# Design System — ViVA (Live Better)

**Reference Source**: Derived from the uploaded homepage screenshot ("Smart Shopping For Modern Living") and the built HTML prototype. Hex values below are close approximations read off the reference image, not exact brand-guide picks — confirm against real brand assets if/when available.

## 1. Brand Tone
- **Trustworthy, fresh, approachable** — deep forest green + cream reads as natural/premium without tipping into luxury-minimal; rounded shapes and soft badges keep it friendly rather than corporate.
- **Deal-forward** — discount badges and strike-through pricing are a first-class visual element, not an afterthought.
- Avoid: harsh pure-black text, saturated primary-red/blue "generic marketplace" clichés, cluttered card shadows on every element.

## 2. Color Palette
| Token | Hex | Usage |
|---|---|---|
| `green-950` | `#0d2a1c` | Darkest text/heading accents, hero headline |
| `green-900` | `#123524` | Primary brand color — header nav pill, buttons, footer, hero sale badge |
| `green-800` | `#17422e` | Hover state for primary buttons/nav |
| `green-600` | `#2c6b48` | Secondary accents (tagline text, icon accents) |
| `green-500` | `#3e8a5f` | Newsletter "Subscribe" button fill |
| `cream` | `#f3efe3` | Hero slide background |
| `sage-100` | `#eef1e6` | Alternate hero slide / "New Arrivals" promo banner background |
| `peach-100` | `#f7ece2` | "Home Refresh" promo banner background |
| `blue-100` | `#e6edf5` | "Tech Essentials" promo banner background |
| `coral` | `#e8756a` | Wishlist/cart count badges, accent CTAs |
| `pink-badge` | `#e77b74` | Discount percentage badges on product cards |
| Neutral text | `#16261d` (dark), `#6b7280`-range grays | Body copy, muted meta text (ratings count, strike-through price) |

**State colors**: star ratings use a warm amber (`#f0a83e`); verified-review checkmark uses standard success green; strike-through original price uses a muted gray, sale price uses a warm red (`#c8503f`) for urgency.

## 3. Typography
- **Display/Heading font**: Poppins (600–800 weight) — used for the logo wordmark, hero headline, section headings ("Top Picks For You," "Loved By Thousands"), and buttons.
- **Body font**: Inter (400–600 weight) — used for paragraph copy, nav links, product names, form inputs.
- **Scale** (approximate): Hero H1 ~2.25–3rem (mobile→desktop), section H2 ~1.25–1.5rem, product card title ~0.875rem, body/meta text ~0.75–0.875rem.
- Keep hero subcopy line length short (matches the reference's narrow measure under the headline).

## 4. Spacing & Layout
- **Base unit**: 4px grid (Tailwind default spacing scale).
- **Container**: max-width ~1280px (`max-w-7xl`), horizontal padding 1rem (mobile) growing with breakpoints.
- **Breakpoints**: mobile-first; key shifts at `sm` (≈640px) and `lg` (≈1024px) — nav becomes non-scrolling, category grid goes from 4 to 9 columns, product carousel shows more cards per view, promo banners go from stacked to 3-up.
- **Layout patterns**: rounded-corner "cards" throughout (hero, banners, product cards) at a consistent large radius (`rounded-2xl`/`rounded-3xl`), giving the page a soft, contained-block rhythm rather than edge-to-edge sections.

## 5. Components

**Buttons**
- Primary: solid `green-900` fill, white text, full pill shape (`rounded-full`), hover → `green-800` + slight lift.
- Secondary/link CTA: text + trailing arrow icon, brand-green text, no fill (used for "Shop Now" inside promo banners, "See All Deals").

**Navigation**
- Desktop: utility bar (dark green, small text) → white header row (logo/search/icons) → white nav row with an "All Categories" pill button styled as a primary button.
- Mobile: nav row becomes horizontally scrollable with no visible scrollbar; search bar collapses/hides behind the icon row at the narrowest widths.

**Cards**
- Product card: white background, thin neutral border, rounded corners, image top with an absolutely-positioned discount badge (pink, rounded-rectangle, top-left), name/rating/price stacked below, circular green add-to-cart button bottom-right. Hover: soft shadow lift.
- Promo banner card: tinted background (sage/peach/blue), no border, content left + small image right, rounded corners.
- Review card: bordered (no fill), avatar + name + verified check + star row at top, quote below.

**Forms & Inputs**
- Search input: pill-shaped, paired with a solid green icon-button on the right edge, no visible border beyond a thin neutral outline.
- Newsletter input: white pill input + solid `green-500` "Subscribe" button, sitting inside a dark-green section band for contrast.

**Carousels (Swiper)**
- Hero: full-bleed slide within a rounded container, dot pagination + prev/next arrow buttons overlaid bottom/sides.
- Product carousel: partial-next-card peek on mobile to signal scrollability; optional manual next-arrow control on desktop.
- Review carousel: 1-up on mobile, 3-up on desktop, no arrows needed if it fits without scrolling at desktop width (arrows optional).

## 6. Motion & Interaction
- Subtle only: button hover = color shift + 1–2px lift; product card hover = soft shadow + slight lift.
- Carousel transitions: standard Swiper slide/fade, moderate speed (no bouncy easing) — keep it fast and utilitarian since this is a shopping page, not a portfolio piece.
- No scroll-triggered/parallax animation implied by the reference — keep motion functional, not decorative.

## 7. Imagery & Iconography
- **Photography**: clean lifestyle/product shots on light or neutral backgrounds (the hero mixes lifestyle staging with individual product cutouts); product-card images are plain product-on-white/light-gray.
- **Iconography**: simple line/solid icon set (category icons sit inside soft tinted circles, one pastel tint per category) — Font Awesome solid icons are a reasonable stand-in if a custom icon set isn't available.
- Avoid heavy illustration or 3D icon styles — the reference favors clean, flat, single-color icons on tinted circular backgrounds.

## 8. Accessibility Notes
- Maintain minimum 4.5:1 contrast for body text; verify white text on `green-900`/`green-500` passes at the font sizes used (subscribe button text in particular).
- All carousels need keyboard-reachable prev/next controls and visible focus rings — don't rely on swipe/drag alone.
- Discount badges and price strike-throughs must not be the *only* signal of a sale — pair with text (e.g., "Save 20%") for screen-reader users, since the reference relies heavily on color/strikethrough alone.
- Respect `prefers-reduced-motion` for carousel autoplay (hero slide autoplay should pause/slow for users who request reduced motion).
