const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect("mongodb://127.0.0.1:27017/ReUse")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const products = [
  {
    title: "Dell Inspiron Laptop",
    price: 28000,
    category: "Electronics",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    description:
      "Dell Inspiron i5 Laptop, 8GB RAM, 512GB SSD. Perfect for students."
  },
  {
    title: "Engineering Mathematics Book",
    price: 450,
    category: "Books",
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
    description:
      "Engineering Mathematics reference book in excellent condition."
  },
  {
    title: "Study Table",
    price: 3200,
    category: "Furniture",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    description:
      "Wooden study table with storage drawer."
  },
  {
    title: "Office Chair",
    price: 2500,
    category: "Furniture",
    condition: "Fair",
    image:
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800",
    description:
      "Comfortable revolving office chair."
  },
  {
    title: "Samsung Galaxy M31",
    price: 9500,
    category: "Electronics",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    description:
      "64GB storage, good battery backup."
  },
  {
    title: "Cricket Bat",
    price: 1800,
    category: "Sports",
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
    description:
      "English willow cricket bat."
  },
  {
    title: "Men's Denim Jacket",
    price: 900,
    category: "Fashion",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    description:
      "Blue denim jacket, size L."
  },
  {
    title: "Wireless Headphones",
    price: 2200,
    category: "Electronics",
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description:
      "Bluetooth headphones with noise cancellation."
  },
  {
    title: "Backpack",
    price: 700,
    category: "Fashion",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    description:
      "Water-resistant laptop backpack."
  },
  {
    title: "Football",
    price: 600,
    category: "Sports",
    condition: "New",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800",
    description:
      "Official size football, never used."
  }
];

async function seedDB() {
  try {
    await Product.deleteMany({});
    console.log("Old Products Deleted");

    await Product.insertMany(products);
    console.log("Dummy Products Inserted");

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

seedDB();