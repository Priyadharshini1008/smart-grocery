# 🗄️ Database Setup Guide

## Option 1 — Run Seed Script (Recommended)

Make sure MongoDB is running, then:

```bash
# Using mongosh (MongoDB 6+)
mongosh smart_grocery seed.js

# Using mongo (older versions)
mongo smart_grocery seed.js
```

This will create the `smart_grocery` database with:
- ✅ 4 users (1 admin + 3 buyers)
- ✅ 40 products across 8 categories
- ✅ 3 sample orders
- ✅ All indexes

---

## Option 2 — Import JSON files

```bash
mongoimport --db smart_grocery --collection users    --file users.json    --jsonArray
mongoimport --db smart_grocery --collection products --file products.json --jsonArray
mongoimport --db smart_grocery --collection orders   --file orders.json   --jsonArray
```

---

## Login Credentials (after seeding)

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@freshmart.com    | admin123  |
| Buyer | priya@gmail.com        | buyer123  |
| Buyer | rahul@gmail.com        | test123   |

---

## Collections Schema

### users
```json
{ "_id", "name", "email", "password (bcrypt)", "role (BUYER/ADMIN)", "phone", "address", "createdAt" }
```

### products
```json
{ "_id", "name", "description", "price", "originalPrice", "stock", "image", "category", "status", "unit", "featured", "rating", "reviewCount", "createdAt" }
```

### carts
```json
{ "_id", "userId", "productId", "quantity", "addedAt" }
```

### orders
```json
{ "_id", "userId", "customerName", "phone", "address", "email", "items[]", "totalPrice", "discount", "finalPrice", "paymentMethod", "paymentStatus", "deliveryStatus", "orderDate", "createdAt" }
```
