<div align="center">
  <img src="frontend/public/images/viva-logo.png" alt="ViVA Logo" width="200" />

  # ViVA E-Commerce Platform
  
  **Smart Shopping For Modern Living**
  
  A modern, high-converting, deal-forward, responsive multi-category e-commerce storefront.

  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)](https://ejs.co/)

</div>

---

## 📖 Overview

**ViVA (Live Better)** is a premium e-commerce platform offering an expansive range of products across Electronics, Fashion, Home & Living, Beauty, Sports, Toys & Kids, Books, and Pet Supplies. 

The architecture is built with a **Node.js/Express** backend and server-rendered views using **EJS**. Styling is meticulously crafted with **Tailwind CSS**, adhering to a custom design system that prioritizes a light theme, modern typography (Poppins + Inter), and a bespoke forest green palette.

---

## ✨ Key Features

- **🛍️ Multi-Category Catalog:** Seamless navigation across diverse product categories.
- **⚡ Deal-Forward Design:** High-converting layout highlighting promotions, top picks, and discounts.
- **🎨 Custom Design System:** Pixel-perfect implementation based on strict visual guidelines, featuring smooth micro-animations and pill-shaped UI components.
- **📱 Fully Responsive:** Optimized across all screen sizes (mobile, tablet, desktop).
- **🔒 Secure Authentication:** Role-based access control for Customers, Sellers, and Admins.
- **🛒 Dynamic Cart & Wishlist:** Real-time badge synchronization using session management and AJAX.
- **📊 Comprehensive Dashboards:** Dedicated analytics, inventory management, and order tracking for both administrators and sellers.

---

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express.js** for server logic and API routes.
- **MongoDB** with **Mongoose ODM** for data persistence.
- **Express-Session** for stateful carts, wishlists, and user sessions.

### Frontend
- **EJS (Embedded JavaScript templating)** for modular, reusable partials (e.g., utility bars, carousels, nav menus).
- **Tailwind CSS** for utility-first styling.
- **Swiper.js v11** for responsive, touch-friendly product and hero carousels.
- **Vanilla JS / jQuery** for DOM manipulation and client-side validations.

---

## 📂 Project Structure

```text
📦 viva
├── 📂 backend
│   ├── 📂 config       # Database connection setups
│   ├── 📂 controllers  # Business logic layer
│   ├── 📂 middleware   # Auth and audit logging
│   ├── 📂 models       # Mongoose schemas
│   ├── 📂 routes       # Express route definitions
│   └── 📜 server.js    # Entry point
├── 📂 frontend
│   ├── 📂 public       # Static assets (CSS, JS, Images, Icons)
│   └── 📂 views        # EJS templates and partials
├── 📂 docs             # AI and Project documentation
├── 📜 .env             # Environment variables
└── 📜 package.json     # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas Cluster)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashj1998/viva.git
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   PORT=3002
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   ADMIN_EMAIL=admin@viva.com
   ADMIN_PASSWORD=admin123
   ```

4. **Run Database Seeders (Optional)**
   Populate your local database with mock products, categories, and settings.
   ```bash
   npm run seed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *The server will typically start at `http://localhost:3002`.*

---

## 🤝 Contributing

We welcome contributions to make ViVA even better! Before submitting PRs, please ensure you review our internal documentation:
- `AGENTS.md` (Global AI rules)
- `docs/ai/DESIGN-SYSTEM.md` (Visual Standards)
- `docs/ai/DEVELOPMENT.md` (Engineering Guidelines)

Please strictly adhere to our **Light Theme Default** and visual consistency guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
