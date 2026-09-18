# ViVA Design System & Visual Specification

**Design Direction**: **Light Theme Default** — Clean, warm, approachable, deal-forward, and premium.
Derived with pixel-level precision from `doc/Smart Shopping For Modern Living.jpg` and `doc/design-system.md`.

---

## 1. Color System

### Primary & Brand Colors
| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| `brand-green-950` | `#0d2a1c` | Darkest heading text, hero typography, deep brand accents |
| `brand-green-900` | `#123524` | Primary brand green: navigation pill, primary CTAs, footer background |
| `brand-green-800` | `#17422e` | Interactive hover state for primary buttons and nav links |
| `brand-green-600` | `#2c6b48` | Secondary brand accents, subtle icons, tagline highlight |
| `brand-green-500` | `#3e8a5f` | Newsletter "Subscribe" button, active focus rings |
| `cream-50` | `#f3efe3` | Hero carousel container background |
| `surface-white` | `#ffffff` | Primary card background, header background, clean contrast surfaces |

### Collection & Promo Banner Tints
| Token Name | Hex Code | Category Usage |
|---|---|---|
| `sage-100` | `#eef1e6` | "New Arrivals" promo banner & fashion/lifestyle highlights |
| `peach-100` | `#f7ece2` | "Home Refresh" promo banner & warm lifestyle elements |
| `blue-100` | `#e6edf5` | "Tech Essentials" promo banner & electronics highlights |
| `rose-100` | `#fbe8e6` | Beauty category badge tint |
| `amber-100` | `#fef3c7` | Home & Living / Toys category badge tint |
| `purple-100` | `#f3e8ff` | Books category badge tint |

### Badges, Alerts & Accents
| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| `coral-500` | `#e8756a` | Notification counters (Wishlist badge `3`, Cart badge `2`) |
| `pink-discount` | `#e77b74` | Product card discount badges (`-20%`, `-25%`, `-30%`) |
| `price-sale` | `#c8503f` | Urgent discounted sale pricing |
| `price-strike` | `#9ca3af` | Muted line-through original price |
| `star-amber` | `#f0a83e` | Product review stars, aggregate rating star |
| `success-green` | `#16a34a` | Verified customer checkmark icon |

### Neutral Text & Borders
| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| `text-dark` | `#16261d` | Body copy, primary card labels, form input text |
| `text-muted` | `#6b7280` | Subtitles, review count `(1,234)`, helper notes |
| `border-subtle` | `#e5e7eb` | Subtle card borders, dividers, search input outline |
| `border-dark` | `#234b35` | Footer dividers, dark card borders |

---

## 2. Typography

We use Google Fonts: **Poppins** (Headings, wordmark, buttons) and **Inter** (Body text, forms, navigation).

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
```

### Scale & Styles
- **Logo Wordmark**: `Poppins`, Weight 700, 1.625rem (`text-2xl`), tracking tight.
- **Hero H1**: `Poppins`, Weight 700, 2.75rem–3.25rem (`text-4xl` to `text-5xl`), line-height tight, color `#0d2a1c`.
- **Section Heading H2**: `Poppins`, Weight 700, 1.375rem–1.625rem (`text-xl` to `text-2xl`), color `#0d2a1c`.
- **Product Title H3**: `Inter`, Weight 600, 0.875rem–0.9375rem (`text-sm`), color `#16261d`.
- **Pricing**:
  - Sale Price: `Inter` / `Poppins`, Weight 700, 1.0625rem, color `#c8503f`.
  - Strike Price: `Inter`, Weight 400, 0.8125rem, line-through, color `#9ca3af`.
- **Body & Captions**: `Inter`, Weight 400/500, 0.75rem–0.875rem (`text-xs` to `text-sm`), color `#4b5563`.

---

## 3. Spacing, Grids & Breakpoints

- **Container**: Max width `1280px` (`max-w-7xl mx-auto`), responsive horizontal padding:
  - Mobile: `px-4` (16px)
  - Tablet: `px-6` (24px)
  - Desktop: `px-8` (32px)
- **Breakpoints**:
  - `sm`: `640px` (Tablets portrait, 2-column cards)
  - `md`: `768px` (Tablets landscape, promo cards 2-up)
  - `lg`: `1024px` (Desktops, 5-card product row, 3-up promo cards, full desktop nav)
  - `xl`: `1280px` (Large display layout)
- **Border Radius Hierarchy**:
  - `rounded-full`: Navigation pill (`All Categories`), CTA buttons, input bars, icon circles, discount badges.
  - `rounded-3xl` (24px–32px): Hero section container, Newsletter banner, promo banner cards.
  - `rounded-2xl` (16px): Product cards, testimonial cards, trust cards.

---

## 4. Component Patterns

### 1. Buttons
- **Primary Pill Button**:
  `bg-[#123524] hover:bg-[#17422e] text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm`
- **Secondary CTA Link**:
  `text-[#123524] hover:text-[#2c6b48] font-semibold text-sm inline-flex items-center gap-1.5 transition-colors`
- **Quick Add-to-Cart Circle Button**:
  `w-9 h-9 rounded-full bg-[#123524] hover:bg-[#17422e] text-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-sm`

### 2. Product Card
- Card background: `#ffffff`, border `1px solid #f3f4f6`, `rounded-2xl`, padding `16px`.
- Top-left discount badge: `bg-[#e77b74] text-white text-xs font-bold px-2 py-0.5 rounded-md`.
- Image: Centered on white background, aspect square or `h-44`, `object-contain`, transition scale on hover.
- Rating: 5 amber stars (`#f0a83e`) + review count in parentheses.
- Pricing Row: Sale price bold red + strike price gray + floating Add-to-Cart circle button on right.

### 3. Category Strip Item
- Circular icon container: `w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105`.
- Label: `text-xs font-medium text-[#16261d] mt-2 text-center`.
- 9 items with custom pastel backgrounds (`#e6edf5`, `#f7ece2`, `#eef1e6`, `#fbe8e6`, etc.).

### 4. Promo Banner Card
- Rounded container (`rounded-3xl`), padding `24px`, flex row layout:
  - Left column: Pill tag ("New Arrivals" / "Home Refresh" / "Tech Essentials"), bold title, "Shop Now →" link.
  - Right column: High-quality cut-out product asset (handbag, armchair with lamp, smartwatch).

### 5. Newsletter Banner
- Rounded container (`rounded-3xl`), background `#123524`, white mail icon inside circular badge, headline "Stay in the Loop", pill input with light-green Subscribe button (`bg-[#3e8a5f] hover:bg-[#347551] text-white rounded-full px-6 py-2`).

---

## 5. Micro-Interactions & Motion Guidelines

- **Transitions**: `transition-all duration-200 ease-in-out` for hover states.
- **Card Hover**: Subtle shadow `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)` and 2px lift.
- **Carousel Controls**: Smooth sliding via Swiper.js; keyboard accessible; pause autoplay on hover or when `prefers-reduced-motion` is active.
