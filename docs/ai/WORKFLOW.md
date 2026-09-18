# ViVA (Live Better) — Development Workflow & Verification

## 1. Core Development Process

Always follow the Antigravity 10-step sequence:
```text
Understand → Inspect → Reuse → Plan → Implement → Test → Review → Fix → Verify → Deliver
```

1. **Understand**: Deeply analyze requirements, visual references, user flows, and acceptance criteria.
2. **Inspect**: Search the existing codebase and `doc/` artifacts before building anything.
3. **Reuse**: Maximize reuse of existing partials, color tokens, and utility functions.
4. **Plan**: Formulate clean internal implementation plans.
5. **Implement**: Write clean, modular, production-ready code with Light Theme default.
6. **Test**: Run local dev server, verify responsiveness, test interactive states and form submissions.
7. **Review**: Self-review against reference design (`Smart Shopping For Modern Living.jpg`).
8. **Fix**: Address any layout shifts, missing states, or console errors.
9. **Verify**: Ensure WCAG AA accessibility, keyboard navigation, and fast loading.
10. **Deliver**: Present concise summary report with implemented changes and verification results.

---

## 2. Component Build Sequence

To construct the ViVA storefront systematically without regressions:

1. **Phase 1: Shared Shell & Design Tokens**
   - Setup `package.json`, install Express, Mongoose, EJS, and dotenv.
   - Configure Tailwind with ViVA tokens (`green-950/900/800/600/500`, `cream-50`, `peach-100`, `sage-100`, `blue-100`, `pink-discount`).
   - Implement `utility-bar.ejs`, `header.ejs`, `nav-bar.ejs`, and `footer.ejs`.
2. **Phase 2: Hero & Category Strip**
   - Implement `hero-carousel.ejs` with sale badge, pill buttons, and Swiper pagination.
   - Implement `category-strip.ejs` with 9 circular pastel badges and hover micro-interactions.
3. **Phase 3: Top Picks & Deal Engine**
   - Build reusable `product-card.ejs` with discount badges, star ratings, and strike-through pricing.
   - Wrap in `product-carousel.ejs` powered by Swiper with navigation arrows.
4. **Phase 4: Curated Collections & Social Proof**
   - Build 3-column `promo-banner-row.ejs` (New Arrivals, Home Refresh, Tech Essentials).
   - Build `testimonial-carousel.ejs` with customer reviews and verified checkmarks.
5. **Phase 5: Conversion & Trust Strips**
   - Build `newsletter-signup.ejs` with AJAX submit and live validation feedback.
   - Build `trust-strip.ejs` highlighting 4 core guarantees.
6. **Phase 6: Interactive State & Cart Polish**
   - Wire up dynamic cart and wishlist counters so clicking Add-to-Cart updates the header badge immediately.
   - Test responsive breakpoints (mobile, tablet, desktop).

---

## 3. Definition of Done Checklist

Every development task is considered complete ONLY when:
- [ ] Visual fidelity matches `doc/Smart Shopping For Modern Living.jpg` (colors, typography, spacing, radius).
- [ ] Light Theme default is strictly preserved with high-contrast, clean surfaces.
- [ ] Responsive across all viewports (`375px` mobile, `768px` tablet, `1024px` laptop, `1280px+` desktop).
- [ ] Dynamic interactions function properly (Swiper slides, cart/wishlist badge increments, newsletter submit).
- [ ] No broken images, console errors, or unstyled flash of content.
- [ ] Verified on local server environment.
