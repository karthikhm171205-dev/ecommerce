const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  // ==================== ELECTRONICS ====================

  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with clear sound.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Electronics",
    stock: 25
  },
  {
    name: "Smart Watch",
    description: "Modern smartwatch with fitness and notification features.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Electronics",
    stock: 15
  },
  {
    name: "Mechanical Keyboard",
    description: "Responsive mechanical keyboard for comfortable typing.",
    price: 3499,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    category: "Electronics",
    stock: 12
  },
  {
    name: "Digital Camera",
    description: "Compact camera for high-quality photography.",
    price: 45999,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    category: "Electronics",
    stock: 8
  },
  {
    name: "Laptop",
    description: "Powerful laptop for study, programming and work.",
    price: 54999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    category: "Electronics",
    stock: 10
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with powerful audio.",
    price: 1799,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    category: "Electronics",
    stock: 18
  },
  {
    name: "Tablet",
    description: "Lightweight tablet for entertainment and productivity.",
    price: 18999,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
    category: "Electronics",
    stock: 14
  },
  {
    name: "Gaming Mouse",
    description: "Precision gaming mouse with ergonomic design.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    category: "Electronics",
    stock: 30
  },
  {
    name: "Smartphone",
    description: "Modern smartphone with excellent performance.",
    price: 24999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    category: "Electronics",
    stock: 20
  },
  {
    name: "USB-C Hub",
    description: "Multi-port USB-C hub for laptops and tablets.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761",
    category: "Electronics",
    stock: 35
  },
  {
    name: "Wireless Earbuds",
    description: "Compact wireless earbuds with clear audio.",
    price: 2299,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
    category: "Electronics",
    stock: 25
  },
  {
    name: "Computer Monitor",
    description: "Full HD monitor suitable for work and gaming.",
    price: 12999,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
    category: "Electronics",
    stock: 12
  },
  {
    name: "Webcam",
    description: "HD webcam for online classes and video calls.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    category: "Electronics",
    stock: 20
  },
  {
    name: "Power Bank",
    description: "Portable power bank for charging devices.",
    price: 1599,
    image: "https://images.unsplash.com/photo-1609592424274-1e8d7c5f5f9d",
    category: "Electronics",
    stock: 30
  },
  {
    name: "Smart TV",
    description: "Large smart television with streaming features.",
    price: 39999,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
    category: "Electronics",
    stock: 7
  },
  {
    name: "Gaming Controller",
    description: "Comfortable wireless controller for gaming.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08",
    category: "Electronics",
    stock: 16
  },
  {
    name: "Portable SSD",
    description: "Fast external SSD for storing files and backups.",
    price: 6999,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",
    category: "Electronics",
    stock: 15
  },
  {
    name: "Wireless Charger",
    description: "Fast wireless charger for compatible smartphones.",
    price: 999,
    image: "https://images.unsplash.com/photo-1609592424274-1e8d7c5f5f9d",
    category: "Electronics",
    stock: 28
  },
  {
    name: "Desk Microphone",
    description: "USB microphone for streaming and online meetings.",
    price: 3999,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc",
    category: "Electronics",
    stock: 11
  },
  {
    name: "VR Headset",
    description: "Immersive virtual reality headset for entertainment.",
    price: 24999,
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac",
    category: "Electronics",
    stock: 6
  },

  // ==================== CLOTHING ====================

  {
    name: "Casual T-Shirt",
    description: "Comfortable casual t-shirt for everyday wear.",
    price: 799,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "Clothing",
    stock: 35
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket with a modern fit.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    category: "Clothing",
    stock: 18
  },
  {
    name: "Hoodie",
    description: "Warm and comfortable hoodie for casual use.",
    price: 1799,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    category: "Clothing",
    stock: 25
  },
  {
    name: "Cotton Shirt",
    description: "Soft cotton shirt suitable for everyday wear.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    category: "Clothing",
    stock: 30
  },
  {
    name: "Formal Shirt",
    description: "Smart formal shirt suitable for office wear.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
    category: "Clothing",
    stock: 22
  },
  {
    name: "Polo Shirt",
    description: "Classic polo shirt with comfortable fabric.",
    price: 999,
    image: "https://images.unsplash.com/photo-1625910513413-5fc45f7a8b0b",
    category: "Clothing",
    stock: 28
  },
  {
    name: "Winter Sweater",
    description: "Warm sweater designed for cold weather.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    category: "Clothing",
    stock: 20
  },
  {
    name: "Track Pants",
    description: "Comfortable track pants for sports and casual use.",
    price: 1199,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea",
    category: "Clothing",
    stock: 32
  },
  {
    name: "Denim Jeans",
    description: "Classic denim jeans with a comfortable fit.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    category: "Clothing",
    stock: 25
  },
  {
    name: "Summer Shorts",
    description: "Lightweight shorts perfect for summer.",
    price: 899,
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
    category: "Clothing",
    stock: 30
  },
  {
    name: "Sports Jersey",
    description: "Lightweight sports jersey for active use.",
    price: 1099,
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e",
    category: "Clothing",
    stock: 24
  },
  {
    name: "Rain Jacket",
    description: "Water-resistant jacket suitable for rainy weather.",
    price: 2199,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f",
    category: "Clothing",
    stock: 15
  },
  {
    name: "Casual Trousers",
    description: "Comfortable trousers for daily wear.",
    price: 1599,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
    category: "Clothing",
    stock: 20
  },
  {
    name: "Baseball Cap",
    description: "Stylish cap suitable for outdoor activities.",
    price: 599,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
    category: "Clothing",
    stock: 40
  },
  {
    name: "Winter Coat",
    description: "Warm winter coat with a modern design.",
    price: 3999,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
    category: "Clothing",
    stock: 12
  },

  // ==================== FOOTWEAR ====================

  {
    name: "Running Shoes",
    description: "Comfortable running shoes for everyday activities.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Footwear",
    stock: 20
  },
  {
    name: "Sports Shoes",
    description: "Lightweight sports shoes for active lifestyles.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
    category: "Footwear",
    stock: 18
  },
  {
    name: "Casual Sneakers",
    description: "Modern sneakers suitable for everyday wear.",
    price: 2199,
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3",
    category: "Footwear",
    stock: 25
  },
  {
    name: "Hiking Boots",
    description: "Durable boots designed for outdoor adventures.",
    price: 3999,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0",
    category: "Footwear",
    stock: 12
  },
  {
    name: "Formal Shoes",
    description: "Classic formal shoes suitable for professional occasions.",
    price: 2799,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1",
    category: "Footwear",
    stock: 16
  },
  {
    name: "Sandals",
    description: "Comfortable sandals for casual outdoor use.",
    price: 899,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306",
    category: "Footwear",
    stock: 30
  },
  {
    name: "Slippers",
    description: "Soft slippers designed for comfortable home use.",
    price: 499,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    category: "Footwear",
    stock: 35
  },
  {
    name: "Basketball Shoes",
    description: "Supportive shoes designed for basketball players.",
    price: 3499,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    category: "Footwear",
    stock: 14
  },
  {
    name: "Walking Shoes",
    description: "Comfortable shoes for walking and daily activities.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    category: "Footwear",
    stock: 22
  },
  {
    name: "Canvas Shoes",
    description: "Lightweight canvas shoes with a casual design.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    category: "Footwear",
    stock: 26
  },

  // ==================== ACCESSORIES ====================

  {
    name: "Travel Backpack",
    description: "Durable backpack with multiple compartments.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    category: "Accessories",
    stock: 30
  },
  {
    name: "Sunglasses",
    description: "Stylish sunglasses with a lightweight frame.",
    price: 999,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    category: "Accessories",
    stock: 35
  },
  {
    name: "Leather Wallet",
    description: "Compact wallet with multiple card slots.",
    price: 899,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    category: "Accessories",
    stock: 25
  },
  {
    name: "Leather Belt",
    description: "Classic leather belt suitable for formal and casual wear.",
    price: 799,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc",
    category: "Accessories",
    stock: 30
  },
  {
    name: "Travel Bag",
    description: "Spacious travel bag for short trips and vacations.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    category: "Accessories",
    stock: 18
  },
  {
    name: "Analog Watch",
    description: "Classic analog watch with an elegant design.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
    category: "Accessories",
    stock: 15
  },
  {
    name: "Key Holder",
    description: "Compact key holder for organizing keys.",
    price: 399,
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b",
    category: "Accessories",
    stock: 40
  },
  {
    name: "Laptop Bag",
    description: "Protective laptop bag suitable for office and travel.",
    price: 1799,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    category: "Accessories",
    stock: 20
  },
  {
    name: "Card Holder",
    description: "Slim card holder for everyday carrying.",
    price: 499,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    category: "Accessories",
    stock: 35
  },
  {
    name: "Travel Organizer",
    description: "Compact organizer for travel documents and accessories.",
    price: 699,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    category: "Accessories",
    stock: 28
  },

  // ==================== HOME ====================

  {
    name: "Coffee Mug",
    description: "Simple ceramic coffee mug for home and office.",
    price: 499,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
    category: "Home",
    stock: 40
  },
  {
    name: "Desk Lamp",
    description: "Modern LED desk lamp with compact design.",
    price: 899,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    category: "Home",
    stock: 25
  },
  {
    name: "Table Clock",
    description: "Minimal table clock for bedrooms and offices.",
    price: 599,
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
    category: "Home",
    stock: 20
  },
  {
    name: "Plant Pot",
    description: "Decorative pot for indoor plants.",
    price: 399,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
    category: "Home",
    stock: 35
  },
  {
    name: "Cushion",
    description: "Soft decorative cushion for sofas and chairs.",
    price: 599,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
    category: "Home",
    stock: 30
  },
  {
    name: "Wall Mirror",
    description: "Modern wall mirror with a clean design.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
    category: "Home",
    stock: 15
  },
  {
    name: "Table Vase",
    description: "Decorative vase suitable for living rooms.",
    price: 699,
    image: "https://images.unsplash.com/photo-1578747763484-51b21a33e4fa",
    category: "Home",
    stock: 22
  },
  {
    name: "Bedside Lamp",
    description: "Elegant bedside lamp for bedrooms.",
    price: 1199,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15",
    category: "Home",
    stock: 18
  },
  {
    name: "Storage Basket",
    description: "Practical basket for organizing household items.",
    price: 799,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
    category: "Home",
    stock: 25
  },
  {
    name: "Ceramic Plate Set",
    description: "Elegant ceramic plates for dining.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0",
    category: "Home",
    stock: 20
  },

  // ==================== SPORTS ====================

  {
    name: "Sports Water Bottle",
    description: "Reusable water bottle for sports and outdoor activities.",
    price: 699,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    category: "Sports",
    stock: 50
  },
  {
    name: "Yoga Mat",
    description: "Comfortable non-slip mat for yoga and exercise.",
    price: 999,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2",
    category: "Sports",
    stock: 30
  },
  {
    name: "Football",
    description: "Durable football suitable for practice and matches.",
    price: 899,
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c",
    category: "Sports",
    stock: 25
  },
  {
    name: "Basketball",
    description: "Quality basketball for training and recreational play.",
    price: 999,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    category: "Sports",
    stock: 20
  },
  {
    name: "Tennis Racket",
    description: "Lightweight tennis racket for beginners and players.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8",
    category: "Sports",
    stock: 15
  },
  {
    name: "Skipping Rope",
    description: "Adjustable skipping rope for cardio workouts.",
    price: 399,
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    category: "Sports",
    stock: 40
  },
  {
    name: "Gym Gloves",
    description: "Comfortable gloves designed for strength training.",
    price: 599,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1a",
    category: "Sports",
    stock: 30
  },
  {
    name: "Resistance Bands",
    description: "Exercise resistance bands for home workouts.",
    price: 799,
    image: "https://images.unsplash.com/photo-1597452485677-d6cc3f0f9a2b",
    category: "Sports",
    stock: 35
  },
  {
    name: "Dumbbell Set",
    description: "Compact dumbbell set for strength training.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
    category: "Sports",
    stock: 12
  },
  {
    name: "Cycling Helmet",
    description: "Protective helmet designed for cycling.",
    price: 1599,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
    category: "Sports",
    stock: 18
  },

  // ==================== FURNITURE ====================

  {
    name: "Office Chair",
    description: "Comfortable ergonomic chair for long working sessions.",
    price: 7999,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    category: "Furniture",
    stock: 10
  },
  {
    name: "Study Table",
    description: "Modern study table suitable for students and professionals.",
    price: 4999,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    category: "Furniture",
    stock: 12
  },
  {
    name: "Bookshelf",
    description: "Spacious bookshelf for books and decorative items.",
    price: 5999,
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156",
    category: "Furniture",
    stock: 8
  },
  {
    name: "Coffee Table",
    description: "Modern coffee table for living rooms.",
    price: 3999,
    image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0",
    category: "Furniture",
    stock: 10
  },
  {
    name: "Dining Chair",
    description: "Comfortable chair designed for dining rooms.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657",
    category: "Furniture",
    stock: 16
  },
  {
    name: "Bedside Table",
    description: "Compact bedside table with storage space.",
    price: 2299,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc",
    category: "Furniture",
    stock: 14
  },
  {
    name: "Modern Sofa",
    description: "Comfortable modern sofa for living rooms.",
    price: 18999,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    category: "Furniture",
    stock: 5
  },
  {
    name: "Wooden Stool",
    description: "Simple wooden stool suitable for home use.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237",
    category: "Furniture",
    stock: 20
  },
  {
    name: "Computer Desk",
    description: "Spacious desk designed for computers and study.",
    price: 4499,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6b1",
    category: "Furniture",
    stock: 12
  },
  {
    name: "Lounge Chair",
    description: "Comfortable lounge chair for reading and relaxation.",
    price: 6999,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    category: "Furniture",
    stock: 8
  },

  // ==================== KITCHEN ====================

  {
    name: "Electric Kettle",
    description: "Fast electric kettle for boiling water.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
    category: "Kitchen",
    stock: 25
  },
  {
    name: "Coffee Maker",
    description: "Compact coffee maker for fresh coffee at home.",
    price: 3499,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
    category: "Kitchen",
    stock: 15
  },
  {
    name: "Blender",
    description: "Powerful kitchen blender for smoothies and drinks.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b",
    category: "Kitchen",
    stock: 18
  },
  {
    name: "Toaster",
    description: "Compact toaster for quick breakfast preparation.",
    price: 1599,
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
    category: "Kitchen",
    stock: 20
  },
  {
    name: "Frying Pan",
    description: "Non-stick frying pan for everyday cooking.",
    price: 999,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
    category: "Kitchen",
    stock: 30
  },
  {
    name: "Knife Set",
    description: "Kitchen knife set for food preparation.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546",
    category: "Kitchen",
    stock: 22
  },
  {
    name: "Dinner Set",
    description: "Complete dinner set for everyday dining.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0",
    category: "Kitchen",
    stock: 15
  },
  {
    name: "Lunch Box",
    description: "Reusable lunch box for school and office.",
    price: 699,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    category: "Kitchen",
    stock: 35
  },
  {
    name: "Water Jug",
    description: "Large reusable water jug for home and office.",
    price: 799,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    category: "Kitchen",
    stock: 25
  },
  {
    name: "Spice Container Set",
    description: "Organized container set for storing spices.",
    price: 899,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
    category: "Kitchen",
    stock: 20
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Product.insertMany(products);

    console.log(`${products.length} new products added successfully!`);

    await mongoose.disconnect();

    console.log("MongoDB Disconnected");

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedProducts();