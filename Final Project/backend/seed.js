const mongoose = require("mongoose");
const Product = require("./models/product");
const User = require("./models/user");
const Message = require("./models/message");
const Transaction = require("./models/transaction");

mongoose
  .connect("mongodb://127.0.0.1:27017/ReUse")
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const SELLER_EMAIL = "jangidjitesh254@gmail.com";
const SELLER_NAME = "Jitesh Jangir";

const products = [
  {
    title: "Dell Inspiron i5 Laptop (16GB RAM)",
    price: 28000,
    category: "Electronics",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    description: "Dell Inspiron Intel i5, 16GB RAM, 512GB NVMe SSD. Perfect for coding, projects, and assignments.",
    location: "Main Campus - Computer Lab",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "Advanced Engineering Mathematics (10th Ed.)",
    price: 550,
    category: "Books",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
    description: "Standard reference textbook for B.Tech engineering mathematics. Clean pages, no highlights.",
    location: "Dormitory Block A",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "Wooden Study Desk with Storage",
    price: 3200,
    category: "Furniture",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    description: "Sturdy wooden study table with smooth drawer sliders. Fits perfectly in campus dorm rooms.",
    location: "Student Hostel 3",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "Ergonomic Mesh Revolving Chair",
    price: 2400,
    category: "Furniture",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800",
    description: "Comfortable revolving office chair with lumbar support and adjustable height.",
    location: "Student Center - Block B",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "Samsung Galaxy M31 (64GB - Dual SIM)",
    price: 8500,
    category: "Electronics",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    description: "6000mAh battery life, 64GB internal memory. Screen guard applied from day one.",
    location: "North Campus Canteen",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "Sony Noise Cancelling Wireless Headphones",
    price: 3500,
    category: "Electronics",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description: "Bluetooth over-ear headphones with deep bass and active noise cancellation. 30hr battery.",
    location: "Main Library - Quiet Zone",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "English Willow Cricket Bat",
    price: 1800,
    category: "Sports",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
    description: "Full size English willow cricket bat, knocked-in and ready for inter-college matches.",
    location: "Sports Complex",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "Classic Denim Jacket (Size L)",
    price: 950,
    category: "Fashion",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    description: "Stylish blue denim jacket. Worn twice only, clean and in mint condition.",
    location: "Student Hostel 1",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  },
  {
    title: "Water-Resistant College Backpack (30L)",
    price: 750,
    category: "Fashion",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    description: "Durable backpack with dedicated 15.6 inch padded laptop compartment and bottle holder.",
    location: "Main Campus Gate",
    sellerEmail: SELLER_EMAIL,
    sellerName: SELLER_NAME,
    status: "Available"
  }
];

async function seedDB() {
  try {
    // 1. Clear old data
    await Product.deleteMany({});
    await Message.deleteMany({});
    await Transaction.deleteMany({});
    console.log("Cleaned old Products, Messages, and Transactions.");

    // 2. Ensure Jitesh Jangir's seller account exists
    let sellerUser = await User.findOne({ email: SELLER_EMAIL });
    if (!sellerUser) {
      sellerUser = await User.create({
        email: SELLER_EMAIL,
        password: "password123",
        firstName: "Jitesh",
        lastName: "Jangir",
        phone: "+91 98765 43210"
      });
      console.log(`Created Seller Account for ${SELLER_NAME} (${SELLER_EMAIL})`);
    } else {
      sellerUser.firstName = "Jitesh";
      sellerUser.lastName = "Jangir";
      await sellerUser.save();
      console.log(`Seller Account Verified for ${SELLER_NAME} (${SELLER_EMAIL})`);
    }

    // 3. Insert fresh items listed by Jitesh Jangir
    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products listed by ${SELLER_NAME}!`);

    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding Failed:", err);
  }
}

seedDB();