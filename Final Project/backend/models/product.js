const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    location: { type: String, default: "Main Campus" },
    sellerEmail: { type: String, default: "seller@university.edu" },
    sellerName: { type: String, default: "Campus Seller" },
    status: { type: String, default: "Available" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
