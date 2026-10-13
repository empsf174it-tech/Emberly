# Emberly — Specialty Coffee Gear Store

**Emberly** is a high-fidelity, production-ready e-commerce web application engineered for specialty coffee enthusiasts and roaster laboratories. Built strictly in semantic vanilla HTML5, custom modern CSS, and modular JavaScript with zero external frameworks (Phosphor icon CDN only).

---

## 🌟 Key Features & Implementation Overview

### 1. 360° Grinder & Brewer Rotational Viewer
- **Interactive Controls:** Drag-to-rotate with mouse and touch gestures, keyboard Left/Right arrow keys (`ArrowLeft`, `ArrowRight`), manual 15° step buttons, and an auto-rotate toggle button.
- **Accessibility & Motion Safety:** Live angle readout (e.g., `0°`, `15°`, `90°`, `180°`), `aria-valuenow`, and strict honoring of `prefers-reduced-motion` media query.
- **Still Perspective Gallery:** Instant one-click thumbnail shortcuts (0° Front, 90° Side, 180° Rear, 270° Profile).
- **Featured Locations:** Home "360° Product Spotlight" and Quick-View Modal "360° View" tab.
- **How to Swap in Real Photogrammetry Frame Sequences:**
  In `assets/js/viewer360.js`, the `Emberly360Viewer` class accepts an options object:
  ```javascript
  const myViewer = new Emberly360Viewer('#container', {
    productId: 'aethel-64-grinder',
    totalFrames: 24, // e.g. 24 or 36 frames
    autoRotateSpeed: 100, // ms per step
    customFrames: [
      'assets/images/360/frame_01.webp',
      'assets/images/360/frame_02.webp',
      // ... 24 or 36 high-resolution product photography frames
      'assets/images/360/frame_24.webp'
    ]
  });
  ```
  When `customFrames` is provided with image URLs, the parametric vector engine automatically renders high-resolution raster image frames instead!

### 2. Interactive Brew-Method Finder
- Select your target brew method: **Espresso (9-Bar)**, **Pour-Over (V60 / Wave)**, **French Press (Immersion)**, or **AeroPress**.
- Filter by experience level and validated budget ceiling.
- Generates a harmonized gear kit (grinder, brewer, kettle, scale) with a technical one-line rationale, starting dose, water yield, ratio, temperature, and brew time.
- **"Add Full Kit to Cart":** Bundles all items into the cart in one click with toast feedback.

### 3. Interactive Grind-Size Guide
- 8-stage interactive stepper and range slider from **Extra-Fine (100–150 μm Turkish)** to **Extra-Coarse (1300–1600 μm Cold Brew)**.
- Dynamic SVG particle cluster preview illustrating particle dispersion and uniformity.
- Matching brew methods, extraction drawdown targets, and extraction troubleshooting advice (sour/watery = grind finer; bitter/astringent = grind coarser).
- Matching grinders linked directly from the shop catalog.

### 4. Gear Shop & Quick-View Modal
- **Multi-faceted Filtering:** Filter instantly by category, brew method, validated numeric price boundaries, minimum rating, and in-stock status.
- **Sorting:** Featured, Price Low-High, Price High-Low, and Top Customer Rated.
- **Quick-View Modal:** 4-tab accessible dialog with Overview, 360° Inspection, Laboratory Specs Table, and Customer Reviews with star breakdowns.
- **Wishlist / Saved Gear:** Persisted per user in `localStorage`.

### 5. Slide-In Cart Drawer & In-Drawer Checkout
- Quantity controls capped by actual lab stock levels.
- Free shipping progress bar against a $75.00 threshold.
- Multi-step checkout wizard (Cart -> Shipping Address -> Sandbox Payment Review -> Order Confirmation).
- **Guest Auth Gating:** Unauthenticated users clicking checkout are redirected to `auth.html` with cart preservation and drawer auto-reopening upon login.
- Inline order confirmation with unique order number generation (e.g. `EMB-90412`), stock decrementing, and automated order recording.

### 6. Architecture & Page-Budget Tradeoff: "My Account" Slide-Over Panel
> **Architecture Note:** Per client requirements and edition page-budget constraints (exactly 5 HTML files with `auth.html` as the 4th/5th page), there is **no standalone dashboard HTML page**.
> Instead, account management lives inside the accessible **"My Account" slide-over drawer** across all pages.
>
> **Slide-Over Panel Tabs:**
> 1. **Orders:** Real-time and historical orders, status badges ("Delivered", "Processing in Lab"), totals, and working "Reorder" action.
> 2. **Saved Gear:** Real-time wishlist items with "Add to Cart" and "Remove" options.
> 3. **Subscriptions:** Active micro-lot subscription plan with frequency controls and pause/resume functionality.
> 4. **Profile:** Validated name, email, and shipping address persistence, plus secure session logout.
>
> *Production Note:* Real commercial authentication requires a secure server-side backend with HTTP-only cookies and cryptographic session tokens. In this client-side demo, only name and email are stored in `localStorage`; passwords are never stored.

---

## 📁 File Structure

```
Emberly/
├── index.html            # Home: Hero steam animation, featured grid, 360 spotlight, brew finder, grind guide, reviews, newsletter
├── about.html            # About: Roaster-to-gear story, testing protocol, team bios, sustainability, CTA
├── services.html         # Services: Gear shop with filters (#shop), brew consultations (#consultations), servicing (#servicing), subscriptions (#subscriptions), shipping (#shipping-returns)
├── contact.html          # Contact: Dedicated enquiry form, character counter, consent validation, lab hotlines, map embed
├── auth.html             # Auth: Dedicated Login & Register tabs, SSL badge, strict validation, redirect handler
├── assets/
│   ├── css/
│   │   └── style.css     # Unified Design System tokens, layout, typography, animations, responsive breakpoints
│   └── js/
│       ├── data.js       # Seed catalog, reviews, orders, subscriptions, brew guides (single source of truth)
│       ├── main.js       # Sticky navbar, accessible dropdowns, mobile drawer, toasts, scroll reveal
│       ├── shop.js       # Catalog rendering, multi-filtering, sorting, quick-view modal, wishlist
│       ├── viewer360.js  # Drag, touch, keyboard, and auto-rotating 360 degree viewer engine
│       ├── finder.js     # Brew-method finder and 8-stage grind-size guide
│       ├── cart.js       # Slide-in cart drawer, stock validation, in-drawer checkout steps
│       ├── account.js    # My Account slide-over panel (orders, wishlist, subscriptions, profile)
│       ├── contact.js    # Enquiry form validation, character counter, consultation booking
│       └── auth.js       # Login and register tab switching, validation, demo session handling
└── README.md             # Complete technical documentation and setup guide
```

---

## 🎨 Design System Specifications

| Token | Implementation |
|---|---|
| **Palette** | Primary: Warm Dark Espresso (`#1C1613`), Secondary: Warm Linen Silk (`#F7F3EE`), Accent: Roasted Caramel Amber (`#C37A38`) |
| **Typography** | Headings: `Fraunces` (H1: 560 weight, H2: 520, H3: 500) · Body: `Plus Jakarta Sans` (420 weight) |
| **Border Radius** | Single global radius: `8px` (`--radius`) |
| **Shadow** | Single global style: `0 10px 30px rgba(28, 22, 19, 0.08)` (`--shadow`) |
| **Icon CDN** | Phosphor Icons Regular & Fill via CDN |
| **Images** | High-resolution Unsplash coffee gear photography with zero repeats across the entire site |

---

## 💻 Local Execution

1. Clone or open the repository folder: `f:\OCTOBER WEBSITE\Emberly`.
2. Start any local static web server or open `index.html` directly in any modern browser:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Navigate through Home, About, Services, Contact, and Auth pages.
