const express = require('express');
const router = express.Router();
const Product = require("../models/product");

// Create product
router.post("/", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create product" });
    }
});

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// Get single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch product details" });
    }
});

// Update product (Owner verification required)
router.put("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const requesterEmail = req.headers['x-user-email'] || req.body.userEmail || req.query.userEmail;

        if (product.sellerEmail && requesterEmail && product.sellerEmail.toLowerCase() !== requesterEmail.toLowerCase()) {
            return res.status(403).json({ message: "Unauthorized: You can only edit products that you listed for sale." });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating product" });
    }
});

// Delete product (Owner verification required)
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const requesterEmail = req.headers['x-user-email'] || req.query.userEmail;

        if (product.sellerEmail && requesterEmail && product.sellerEmail.toLowerCase() !== requesterEmail.toLowerCase()) {
            return res.status(403).json({ message: "Unauthorized: You can only delete products that you listed for sale." });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting product" });
    }
});

module.exports = router;