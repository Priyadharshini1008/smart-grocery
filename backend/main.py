from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from bson import ObjectId
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional, List
import hashlib
import time

app = FastAPI(title="FreshMart API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DATABASE ────────────────────────────
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client       = MongoClient(MONGO_URL)
db           = client["smart_grocery"]
users_col    = db["users"]
products_col = db["products"]
carts_col    = db["carts"]
orders_col   = db["orders"]

try:
    users_col.create_index("email", unique=True)
except:
    pass

# ── PASSWORD ────────────────────────────
# We store passwords as plain text in seed
# and as md5 after registration
def make_hash(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()

def check_password(plain: str, stored: str) -> bool:
    # Match plain text (seeded users)
    if plain == stored:
        return True
    # Match md5 hash (registered users)
    if make_hash(plain) == stored:
        return True
    return False

# ── JWT ─────────────────────────────────
SECRET = "freshmart2024"

def make_token(data: dict) -> str:
    d = data.copy()
    d["exp"] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(d, SECRET, algorithm="HS256")

def read_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])
    except:
        raise HTTPException(401, "Invalid token")

bearer = HTTPBearer()

def get_user(c: HTTPAuthorizationCredentials = Depends(bearer)):
    return read_token(c.credentials)

def get_admin(c: HTTPAuthorizationCredentials = Depends(bearer)):
    u = read_token(c.credentials)
    if u.get("role") != "ADMIN":
        raise HTTPException(403, "Admin only")
    return u

# ── HELPERS ─────────────────────────────
def fix(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def by_id(col, id):
    try:
        d = col.find_one({"_id": ObjectId(id)})
        return fix(d) if d else None
    except:
        return None

# ── MODELS ──────────────────────────────
class Register(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = ""
    address: Optional[str] = ""

class Login(BaseModel):
    email: str
    password: str

class Product(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    originalPrice: Optional[float] = 0
    stock: int
    image: Optional[str] = ""
    category: Optional[str] = "Vegetables"
    unit: Optional[str] = "kg"
    featured: Optional[bool] = False
    rating: Optional[float] = 4.0
    reviewCount: Optional[int] = 0

class CartAdd(BaseModel):
    productId: str
    quantity: Optional[int] = 1

class CartUpdate(BaseModel):
    quantity: int

class StockUpdate(BaseModel):
    stock: int

class OrderItemModel(BaseModel):
    productId: str
    quantity: int

class PlaceOrder(BaseModel):
    customerName: str
    phone: str
    address: str
    email: Optional[str] = ""
    paymentMethod: Optional[str] = "COD"
    items: List[OrderItemModel]

class StatusUpdate(BaseModel):
    status: str

# ── AUTH ────────────────────────────────
@app.post("/api/auth/register")
def register(req: Register):
    if users_col.find_one({"email": req.email}):
        raise HTTPException(400, "Email already registered")
    doc = {
        "name": req.name,
        "email": req.email,
        "password": make_hash(req.password),
        "role": "BUYER",
        "phone": req.phone,
        "address": req.address,
        "createdAt": int(time.time() * 1000)
    }
    r = users_col.insert_one(doc)
    uid = str(r.inserted_id)
    token = make_token({"sub": req.email, "role": "BUYER", "userId": uid})
    return {
        "token": token,
        "user": {"id": uid, "name": req.name, "email": req.email,
                 "role": "BUYER", "phone": req.phone, "address": req.address}
    }

@app.post("/api/auth/login")
def login(req: Login):
    user = users_col.find_one({"email": req.email})
    if not user:
        raise HTTPException(401, "Invalid email or password")

    if not check_password(req.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")

    # If password was plain text, upgrade it to hash
    if user["password"] == req.password:
        users_col.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": make_hash(req.password)}}
        )

    uid = str(user["_id"])
    token = make_token({"sub": req.email, "role": user["role"], "userId": uid})
    return {
        "token": token,
        "user": {
            "id": uid,
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "phone": user.get("phone", ""),
            "address": user.get("address", "")
        }
    }

# ── PRODUCTS PUBLIC ──────────────────────
@app.get("/api/products/public/all")
def all_products():
    return [fix(d) for d in products_col.find()]

@app.get("/api/products/public/available")
def available():
    return [fix(d) for d in products_col.find({"status": "Available"})]

@app.get("/api/products/public/featured")
def featured():
    return [fix(d) for d in products_col.find({"featured": True, "status": "Available"})]

@app.get("/api/products/public/search")
def search(q: str = ""):
    import re
    return [fix(d) for d in products_col.find(
        {"name": {"$regex": re.escape(q), "$options": "i"}})]

@app.get("/api/products/public/category/{cat}")
def by_category(cat: str):
    return [fix(d) for d in products_col.find(
        {"category": cat, "status": "Available"})]

@app.get("/api/products/public/{pid}")
def get_product(pid: str):
    d = by_id(products_col, pid)
    if not d:
        raise HTTPException(404, "Not found")
    return d

# ── PRODUCTS ADMIN ───────────────────────
@app.post("/api/admin/products")
def add_product(p: Product, admin=Depends(get_admin)):
    doc = p.model_dump()
    doc["status"] = "Out of Stock" if doc["stock"] == 0 else "Available"
    doc["createdAt"] = int(time.time() * 1000)
    r = products_col.insert_one(doc)
    doc["id"] = str(r.inserted_id)
    del doc["_id"]
    return doc

@app.put("/api/admin/products/{pid}")
def update_product(pid: str, p: Product, admin=Depends(get_admin)):
    doc = p.model_dump()
    doc["status"] = "Out of Stock" if doc["stock"] == 0 else "Available"
    try:
        products_col.update_one({"_id": ObjectId(pid)}, {"$set": doc})
    except:
        raise HTTPException(404, "Not found")
    return by_id(products_col, pid)

@app.delete("/api/admin/products/{pid}")
def delete_product(pid: str, admin=Depends(get_admin)):
    try:
        products_col.delete_one({"_id": ObjectId(pid)})
    except:
        pass
    return {"message": "Deleted"}

@app.patch("/api/admin/products/{pid}/stock")
def update_stock(pid: str, body: StockUpdate, admin=Depends(get_admin)):
    s = "Out of Stock" if body.stock == 0 else "Available"
    try:
        products_col.update_one({"_id": ObjectId(pid)},
                                {"$set": {"stock": body.stock, "status": s}})
    except:
        raise HTTPException(404, "Not found")
    return by_id(products_col, pid)

# ── CART ────────────────────────────────
@app.get("/api/cart")
def get_cart(user=Depends(get_user)):
    uid = user["userId"]
    result = []
    for item in carts_col.find({"userId": uid}):
        p = by_id(products_col, item["productId"])
        if p:
            result.append({
                "cartId": str(item["_id"]),
                "productId": p["id"],
                "name": p["name"],
                "price": p["price"],
                "image": p.get("image", ""),
                "unit": p.get("unit", ""),
                "quantity": item["quantity"],
                "subtotal": p["price"] * item["quantity"],
                "status": p["status"]
            })
    return result

@app.post("/api/cart/add")
def add_cart(body: CartAdd, user=Depends(get_user)):
    uid = user["userId"]
    p = by_id(products_col, body.productId)
    if not p:
        raise HTTPException(404, "Product not found")
    if p["status"] == "Out of Stock":
        raise HTTPException(400, "Out of stock")
    existing = carts_col.find_one({"userId": uid, "productId": body.productId})
    if existing:
        carts_col.update_one({"_id": existing["_id"]},
                             {"$inc": {"quantity": body.quantity}})
        return fix(carts_col.find_one({"_id": existing["_id"]}))
    doc = {"userId": uid, "productId": body.productId,
           "quantity": body.quantity, "addedAt": int(time.time() * 1000)}
    r = carts_col.insert_one(doc)
    doc["id"] = str(r.inserted_id)
    return doc

@app.put("/api/cart/update/{cid}")
def update_cart(cid: str, body: CartUpdate, user=Depends(get_user)):
    if body.quantity <= 0:
        try:
            carts_col.delete_one({"_id": ObjectId(cid)})
        except:
            pass
        return {"message": "Removed"}
    try:
        carts_col.update_one({"_id": ObjectId(cid)},
                             {"$set": {"quantity": body.quantity}})
    except:
        pass
    return {"message": "Updated"}

@app.delete("/api/cart/remove/{cid}")
def remove_cart(cid: str, user=Depends(get_user)):
    try:
        carts_col.delete_one({"_id": ObjectId(cid)})
    except:
        pass
    return {"message": "Removed"}

@app.delete("/api/cart/clear")
def clear_cart(user=Depends(get_user)):
    carts_col.delete_many({"userId": user["userId"]})
    return {"message": "Cleared"}

# ── ORDERS ──────────────────────────────
@app.post("/api/orders/place")
def place_order(req: PlaceOrder, user=Depends(get_user)):
    uid = user["userId"]
    items = []
    total = 0.0
    for item in req.items:
        p = by_id(products_col, item.productId)
        if not p:
            continue
        sub = p["price"] * item.quantity
        total += sub
        items.append({
            "productId": item.productId,
            "productName": p["name"],
            "image": p.get("image", ""),
            "price": p["price"],
            "quantity": item.quantity,
            "subtotal": sub
        })
        new_stock = max(0, p.get("stock", 0) - item.quantity)
        try:
            products_col.update_one({"_id": ObjectId(item.productId)}, {"$set": {
                "stock": new_stock,
                "status": "Out of Stock" if new_stock == 0 else "Available"
            }})
        except:
            pass

    discount = total * 0.10 if total > 2000 else 0.0
    final = total - discount
    order = {
        "userId": uid,
        "customerName": req.customerName,
        "phone": req.phone,
        "address": req.address,
        "email": req.email,
        "items": items,
        "totalPrice": total,
        "discount": discount,
        "finalPrice": final,
        "paymentMethod": req.paymentMethod,
        "paymentStatus": "Pending" if req.paymentMethod == "COD" else "Paid",
        "deliveryStatus": "Processing",
        "orderDate": datetime.now().strftime("%Y-%m-%d"),
        "createdAt": int(time.time() * 1000)
    }
    r = orders_col.insert_one(order)
    order["id"] = str(r.inserted_id)
    del order["_id"]
    carts_col.delete_many({"userId": uid})
    return {
        "order": order,
        "message": "Order placed successfully! 🎉",
        "deliveryMessage": "Door delivery between 5 PM – 7 PM 🚚"
    }

@app.get("/api/orders/my-orders")
def my_orders(user=Depends(get_user)):
    return [fix(d) for d in orders_col.find(
        {"userId": user["userId"]}).sort("createdAt", -1)]

@app.get("/api/orders/admin/all")
def all_orders(admin=Depends(get_admin)):
    return [fix(d) for d in orders_col.find().sort("createdAt", -1)]

@app.get("/api/orders/admin/today")
def today_orders(admin=Depends(get_admin)):
    today = datetime.now().strftime("%Y-%m-%d")
    return [fix(d) for d in orders_col.find(
        {"orderDate": today}).sort("createdAt", -1)]

@app.get("/api/orders/admin/stats")
def stats(admin=Depends(get_admin)):
    today = datetime.now().strftime("%Y-%m-%d")
    t = list(orders_col.find({"orderDate": today}))
    a = list(orders_col.find())
    return {
        "todayOrders": len(t),
        "todaySales":  sum(o.get("finalPrice", 0) for o in t),
        "totalOrders": len(a),
        "totalSales":  sum(o.get("finalPrice", 0) for o in a)
    }

@app.put("/api/orders/admin/{oid}/status")
def update_status(oid: str, body: StatusUpdate, admin=Depends(get_admin)):
    try:
        orders_col.update_one({"_id": ObjectId(oid)},
                              {"$set": {"deliveryStatus": body.status}})
    except:
        raise HTTPException(404, "Not found")
    return by_id(orders_col, oid)

@app.get("/api/orders/{oid}")
def get_order(oid: str, user=Depends(get_user)):
    d = by_id(orders_col, oid)
    if not d:
        raise HTTPException(404, "Not found")
    return d

# ── ADMIN ───────────────────────────────
@app.get("/api/admin/customers")
def customers(admin=Depends(get_admin)):
    result = []
    for d in users_col.find({"role": "BUYER"}):
        d = fix(d)
        d.pop("password", None)
        result.append(d)
    return result

# ── RUN ─────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("🚀 FreshMart API → http://localhost:8080")
    print("📖 Docs         → http://localhost:8080/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
