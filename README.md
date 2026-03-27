# 🛒 FreshMart — Smart Grocery E-Commerce System

A complete full-stack grocery ordering platform.

**Stack:** React JS + Spring Boot + MongoDB + JWT Auth

---

## 📁 Project Structure

```
smart-grocery/
├── frontend/                          ← React JS (Port 3000)
│   ├── public/index.html
│   ├── package.json
│   └── src/
│       ├── index.js / index.css       ← Entry point + global styles
│       ├── App.js                     ← Router + protected routes
│       ├── services/api.js            ← All Axios API calls
│       ├── context/
│       │   ├── AuthContext.js         ← JWT login/logout state
│       │   └── CartContext.js         ← Cart items + totals
│       ├── components/common/
│       │   ├── Navbar.js              ← Top navigation bar
│       │   └── Navbar.css
│       └── pages/
│           ├── LandingPage.js         ← Public homepage
│           ├── LoginPage.js           ← Login form
│           ├── RegisterPage.js        ← Register form
│           ├── buyer/
│           │   ├── ShopPage.js        ← Browse + search + filter products
│           │   ├── CartPage.js        ← Cart with 10% discount logic
│           │   ├── CheckoutPage.js    ← Delivery + payment selection
│           │   ├── OrderSuccessPage.js ← Success + delivery message
│           │   └── MyOrdersPage.js    ← Order history + live tracking
│           └── admin/
│               ├── AdminDashboard.js  ← Stats + today's orders table
│               ├── AdminProducts.js   ← Add / edit / delete products
│               ├── AdminOrders.js     ← All orders + status update
│               └── AdminCustomers.js  ← Customer list with spend stats
│
├── backend/                           ← Spring Boot (Port 8080)
│   ├── pom.xml
│   └── src/main/java/com/smartgrocery/
│       ├── SmartGroceryApplication.java
│       ├── config/
│       │   ├── JwtUtil.java           ← JWT generate/validate
│       │   ├── JwtFilter.java         ← JWT request filter
│       │   └── SecurityConfig.java    ← Spring Security config
│       ├── model/
│       │   ├── User.java
│       │   ├── Product.java
│       │   ├── Cart.java
│       │   └── Order.java             ← Includes OrderItem inner class
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── ProductRepository.java
│       │   ├── CartRepository.java
│       │   └── OrderRepository.java
│       └── controller/
│           ├── AuthController.java    ← /api/auth/register, /api/auth/login
│           ├── ProductController.java ← Public + admin product endpoints
│           ├── CartController.java    ← Cart CRUD
│           ├── OrderController.java   ← Place order, my orders, admin orders
│           └── AdminController.java   ← Customer list
│
└── database/
    ├── seed.js                        ← Full MongoDB seed script
    └── README_DB.md                   ← DB setup instructions
```

---

## 🚀 How to Run

### Step 1 — Start MongoDB
```bash
mongod --dbpath /data/db
```

### Step 2 — Seed the Database
```bash
cd database
mongosh smart_grocery seed.js
```

### Step 3 — Start Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Step 4 — Start Frontend
```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

---

## 🔑 Login Credentials (after seeding)

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@freshmart.com | admin123 |
| Buyer | priya@gmail.com     | buyer123 |
| Buyer | rahul@gmail.com     | test123  |

---

## 💰 Discount Logic

| Cart Total | Discount |
|------------|----------|
| < ₹2000    | No discount |
| > ₹2000    | 10% OFF auto-applied |

---

## 🚚 Delivery

Every order shows: **"Door delivery between 5 PM – 7 PM"**

Admin can update delivery status:
`Processing → Confirmed → Out for Delivery → Delivered`

---

## 🔐 API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register buyer |
| POST | /api/auth/login | Public | Login (returns JWT) |
| GET | /api/products/public/available | Public | List all available products |
| GET | /api/products/public/category/:cat | Public | Filter by category |
| GET | /api/products/public/search?q= | Public | Search products |
| GET | /api/products/public/featured | Public | Featured products |
| GET | /api/cart | BUYER | Get cart items |
| POST | /api/cart/add | BUYER | Add item to cart |
| PUT | /api/cart/update/:cartId | BUYER | Update quantity |
| DELETE | /api/cart/remove/:cartId | BUYER | Remove item |
| DELETE | /api/cart/clear | BUYER | Clear entire cart |
| POST | /api/orders/place | BUYER | Place order |
| GET | /api/orders/my-orders | BUYER | My orders |
| POST | /api/admin/products | ADMIN | Add product |
| PUT | /api/admin/products/:id | ADMIN | Update product |
| DELETE | /api/admin/products/:id | ADMIN | Delete product |
| PATCH | /api/admin/products/:id/stock | ADMIN | Update stock |
| GET | /api/orders/admin/all | ADMIN | All orders |
| GET | /api/orders/admin/today | ADMIN | Today's orders |
| GET | /api/orders/admin/stats | ADMIN | Sales statistics |
| PUT | /api/orders/admin/:id/status | ADMIN | Update delivery status |
| GET | /api/admin/customers | ADMIN | All customers |

---

## 📦 Features

### Buyer
- Register / Login
- Browse 40+ products across 8 categories
- Search + filter by category
- Add to cart, update quantities
- Auto 10% discount on orders > ₹2000
- 3 payment modes: COD, UPI, Card
- Order tracking with status steps
- Order history

### Admin
- Dashboard with today's stats (orders + revenue)
- Add/Edit/Delete products with image URL
- Mark products in stock / out of stock
- View all orders, filter by status
- Update delivery status inline
- Customer directory with spend analytics
