db = db.getSiblingDB('smart_grocery');
print("🗑️  Clearing existing data...");
db.users.drop(); db.products.drop(); db.carts.drop(); db.orders.drop();
print("✅ Collections cleared");
db.users.createIndex({ email: 1 }, { unique: true });
print("✅ Indexes created");

// Passwords are PLAIN TEXT - backend auto-upgrades on first login
print("👤 Seeding users...");
db.users.insertMany([
  { name:"Admin User", email:"admin@freshmart.com", password:"admin123", role:"ADMIN", phone:"9999999999", address:"FreshMart HQ Chennai", createdAt:Date.now() },
  { name:"Priya Sharma", email:"priya@gmail.com", password:"buyer123", role:"BUYER", phone:"9876543210", address:"Anna Nagar Chennai", createdAt:Date.now() },
  { name:"Rahul Kumar", email:"rahul@gmail.com", password:"test123", role:"BUYER", phone:"9123456789", address:"T Nagar Chennai", createdAt:Date.now() }
]);
print("✅ Users seeded");

print("🛒 Seeding products...");
db.products.insertMany([
  {name:"Fresh Red Apple",description:"Crisp sweet apples",price:180,originalPrice:220,stock:150,image:"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",category:"Fruits",status:"Available",unit:"kg",featured:true,rating:4.7,reviewCount:234,createdAt:Date.now()},
  {name:"Alphonso Mango",description:"King of mangoes",price:350,originalPrice:420,stock:80,image:"https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",category:"Fruits",status:"Available",unit:"kg",featured:true,rating:4.9,reviewCount:512,createdAt:Date.now()},
  {name:"Cavendish Banana",description:"Fresh bananas",price:60,originalPrice:0,stock:200,image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",category:"Fruits",status:"Available",unit:"dozen",featured:false,rating:4.5,reviewCount:180,createdAt:Date.now()},
  {name:"Seedless Green Grapes",description:"Juicy sweet grapes",price:120,originalPrice:150,stock:100,image:"https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80",category:"Fruits",status:"Available",unit:"kg",featured:false,rating:4.6,reviewCount:98,createdAt:Date.now()},
  {name:"Fresh Strawberries",description:"Sweet strawberries",price:199,originalPrice:250,stock:60,image:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",category:"Fruits",status:"Available",unit:"pack",featured:true,rating:4.8,reviewCount:145,createdAt:Date.now()},
  {name:"Organic Tomatoes",description:"Farm fresh tomatoes",price:45,originalPrice:60,stock:300,image:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",category:"Vegetables",status:"Available",unit:"kg",featured:true,rating:4.5,reviewCount:320,createdAt:Date.now()},
  {name:"Baby Spinach",description:"Tender spinach leaves",price:55,originalPrice:0,stock:120,image:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",category:"Vegetables",status:"Available",unit:"pack",featured:false,rating:4.4,reviewCount:88,createdAt:Date.now()},
  {name:"Fresh Broccoli",description:"Crispy broccoli",price:80,originalPrice:100,stock:90,image:"https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",category:"Vegetables",status:"Available",unit:"piece",featured:false,rating:4.6,reviewCount:112,createdAt:Date.now()},
  {name:"Carrot Bundle",description:"Sweet orange carrots",price:40,originalPrice:0,stock:200,image:"https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&q=80",category:"Vegetables",status:"Available",unit:"bundle",featured:false,rating:4.3,reviewCount:76,createdAt:Date.now()},
  {name:"Bell Peppers",description:"3 color peppers combo",price:120,originalPrice:150,stock:70,image:"https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80",category:"Vegetables",status:"Available",unit:"pack",featured:true,rating:4.7,reviewCount:94,createdAt:Date.now()},
  {name:"Amul Fresh Milk",description:"Full cream milk",price:62,originalPrice:0,stock:500,image:"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",category:"Dairy",status:"Available",unit:"litre",featured:true,rating:4.8,reviewCount:650,createdAt:Date.now()},
  {name:"Amul Butter",description:"Creamy salted butter",price:58,originalPrice:65,stock:200,image:"https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",category:"Dairy",status:"Available",unit:"pack",featured:false,rating:4.9,reviewCount:890,createdAt:Date.now()},
  {name:"Greek Yogurt",description:"Thick creamy yogurt",price:95,originalPrice:110,stock:150,image:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",category:"Dairy",status:"Available",unit:"pack",featured:false,rating:4.6,reviewCount:210,createdAt:Date.now()},
  {name:"Paneer Fresh",description:"Soft homestyle paneer",price:140,originalPrice:0,stock:80,image:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",category:"Dairy",status:"Available",unit:"pack",featured:true,rating:4.7,reviewCount:340,createdAt:Date.now()},
  {name:"Cheddar Cheese",description:"Processed cheddar slices",price:185,originalPrice:210,stock:120,image:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80",category:"Dairy",status:"Available",unit:"pack",featured:false,rating:4.5,reviewCount:178,createdAt:Date.now()},
  {name:"Whole Wheat Bread",description:"Multigrain bread",price:48,originalPrice:55,stock:100,image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",category:"Bakery",status:"Available",unit:"piece",featured:false,rating:4.4,reviewCount:230,createdAt:Date.now()},
  {name:"Butter Croissant",description:"Flaky buttery croissants",price:85,originalPrice:0,stock:60,image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",category:"Bakery",status:"Available",unit:"pack",featured:true,rating:4.8,reviewCount:167,createdAt:Date.now()},
  {name:"Banana Muffins",description:"Moist banana muffins",price:120,originalPrice:145,stock:40,image:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80",category:"Bakery",status:"Available",unit:"pack",featured:false,rating:4.6,reviewCount:89,createdAt:Date.now()},
  {name:"Sourdough Loaf",description:"Artisan sourdough bread",price:180,originalPrice:200,stock:30,image:"https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80",category:"Bakery",status:"Available",unit:"piece",featured:true,rating:4.9,reviewCount:120,createdAt:Date.now()},
  {name:"Tropicana Orange Juice",description:"100% orange juice",price:99,originalPrice:120,stock:150,image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",category:"Beverages",status:"Available",unit:"litre",featured:true,rating:4.5,reviewCount:445,createdAt:Date.now()},
  {name:"Cold Brew Coffee",description:"Smooth cold brew",price:149,originalPrice:180,stock:80,image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",category:"Beverages",status:"Available",unit:"pack",featured:true,rating:4.7,reviewCount:298,createdAt:Date.now()},
  {name:"Coconut Water",description:"Natural coconut water",price:45,originalPrice:0,stock:200,image:"https://images.unsplash.com/photo-1536620577185-5b95e9741fd3?w=400&q=80",category:"Beverages",status:"Available",unit:"pack",featured:false,rating:4.6,reviewCount:312,createdAt:Date.now()},
  {name:"Green Tea Pack",description:"Premium green tea 25 bags",price:180,originalPrice:220,stock:100,image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",category:"Beverages",status:"Available",unit:"pack",featured:false,rating:4.8,reviewCount:190,createdAt:Date.now()},
  {name:"Mango Lassi",description:"Thick mango lassi",price:65,originalPrice:80,stock:90,image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",category:"Beverages",status:"Available",unit:"litre",featured:false,rating:4.7,reviewCount:267,createdAt:Date.now()},
  {name:"Lays Classic Salted",description:"Crispy potato chips",price:30,originalPrice:0,stock:500,image:"https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",category:"Snacks",status:"Available",unit:"pack",featured:false,rating:4.6,reviewCount:890,createdAt:Date.now()},
  {name:"Mixed Nuts Premium",description:"Cashews almonds walnuts",price:350,originalPrice:420,stock:80,image:"https://images.unsplash.com/photo-1567549570933-3f6d55148e37?w=400&q=80",category:"Snacks",status:"Available",unit:"pack",featured:true,rating:4.8,reviewCount:234,createdAt:Date.now()},
  {name:"Dark Chocolate Bar",description:"70% cocoa chocolate",price:120,originalPrice:140,stock:150,image:"https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&q=80",category:"Snacks",status:"Available",unit:"piece",featured:false,rating:4.7,reviewCount:445,createdAt:Date.now()},
  {name:"Roasted Popcorn",description:"Butter flavored popcorn",price:85,originalPrice:100,stock:200,image:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",category:"Snacks",status:"Available",unit:"pack",featured:false,rating:4.4,reviewCount:312,createdAt:Date.now()},
  {name:"Protein Granola Bar",description:"High protein oat bar 6 pack",price:180,originalPrice:210,stock:120,image:"https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=400&q=80",category:"Snacks",status:"Available",unit:"pack",featured:true,rating:4.5,reviewCount:178,createdAt:Date.now()},
  {name:"Chicken Breast Boneless",description:"Fresh chicken breast",price:280,originalPrice:320,stock:50,image:"https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80",category:"Meat",status:"Available",unit:"kg",featured:true,rating:4.7,reviewCount:156,createdAt:Date.now()},
  {name:"Mutton Curry Cut",description:"Fresh goat meat",price:650,originalPrice:720,stock:30,image:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80",category:"Meat",status:"Available",unit:"kg",featured:false,rating:4.6,reviewCount:89,createdAt:Date.now()},
  {name:"Fresh Fish Fillet",description:"Boneless fish fillet",price:380,originalPrice:0,stock:40,image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",category:"Meat",status:"Available",unit:"kg",featured:false,rating:4.5,reviewCount:67,createdAt:Date.now()},
  {name:"Farm Fresh Eggs 12",description:"Country farm eggs",price:90,originalPrice:105,stock:300,image:"https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",category:"Meat",status:"Available",unit:"dozen",featured:true,rating:4.8,reviewCount:678,createdAt:Date.now()},
  {name:"Frozen Green Peas",description:"Sweet peas flash frozen",price:65,originalPrice:80,stock:200,image:"https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",category:"Frozen",status:"Available",unit:"pack",featured:false,rating:4.3,reviewCount:134,createdAt:Date.now()},
  {name:"Frozen French Fries",description:"Crispy golden fries",price:120,originalPrice:145,stock:150,image:"https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400&q=80",category:"Frozen",status:"Available",unit:"pack",featured:true,rating:4.6,reviewCount:445,createdAt:Date.now()},
  {name:"Frozen Pizza Margherita",description:"Classic margherita pizza",price:299,originalPrice:350,stock:60,image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",category:"Frozen",status:"Available",unit:"piece",featured:true,rating:4.5,reviewCount:289,createdAt:Date.now()},
  {name:"Ice Cream Vanilla",description:"Creamy vanilla ice cream",price:250,originalPrice:300,stock:80,image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",category:"Frozen",status:"Available",unit:"litre",featured:false,rating:4.7,reviewCount:567,createdAt:Date.now()},
  {name:"Frozen Corn Kernels",description:"Sweet golden corn",price:75,originalPrice:0,stock:180,image:"https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80",category:"Frozen",status:"Available",unit:"pack",featured:false,rating:4.2,reviewCount:98,createdAt:Date.now()}
]);
print("✅ Products seeded: 40 products");
print("==============================================");
print("✅  DATABASE SEED COMPLETE!");
print("==============================================");
print("   users:    " + db.users.countDocuments());
print("   products: " + db.products.countDocuments());
print("🔑 ADMIN:  admin@freshmart.com / admin123");
print("🔑 BUYER1: priya@gmail.com     / buyer123");
print("🔑 BUYER2: rahul@gmail.com     / test123");
print("==============================================");
