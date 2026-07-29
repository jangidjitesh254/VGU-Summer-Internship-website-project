const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const Product = require("../models/product");

// Create Escrow Checkout Purchase
router.post("/checkout", async (req, res) => {
    try {
        const { productId, productTitle, productImage, amount, buyerEmail, buyerName, sellerEmail, sellerName } = req.body;

        if (!productId || !amount || !buyerEmail || !sellerEmail) {
            return res.status(400).json({ message: "Product details, amount, buyer, and seller are required." });
        }

        const transaction = await Transaction.create({
            productId,
            productTitle: productTitle || "Campus Item",
            productImage: productImage || "",
            amount,
            buyerEmail: buyerEmail.toLowerCase().trim(),
            buyerName: buyerName || "Buyer",
            sellerEmail: sellerEmail.toLowerCase().trim(),
            sellerName: sellerName || "Seller",
            type: "Escrow Purchase",
            status: "Held in Escrow"
        });

        // Update product status
        await Product.findByIdAndUpdate(productId, { status: "Escrow Pending" });

        res.status(201).json({
            message: "Payment held safely in Escrow! Funds will be released to seller upon your inspection.",
            transaction
        });
    } catch (err) {
        console.error("Escrow Checkout Error:", err);
        res.status(500).json({ message: "Server error creating escrow transaction." });
    }
});

// Fetch User Purchases and Sales
router.get("/user", async (req, res) => {
    try {
        const email = req.query.email ? req.query.email.toLowerCase().trim() : null;
        if (!email) {
            return res.status(400).json({ message: "Email query parameter required." });
        }

        const purchases = await Transaction.find({ buyerEmail: email }).sort({ createdAt: -1 });
        const sales = await Transaction.find({ sellerEmail: email }).sort({ createdAt: -1 });

        res.json({ purchases, sales });
    } catch (err) {
        console.error("User Transactions Error:", err);
        res.status(500).json({ message: "Server error fetching transactions." });
    }
});

// Release Escrow Funds to Seller
router.put("/:id/release", async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        transaction.status = "Released";
        await transaction.save();

        // Update product to Sold
        await Product.findByIdAndUpdate(transaction.productId, { status: "Sold" });

        res.json({
            message: "Escrow payment released to seller! Transaction completed.",
            transaction
        });
    } catch (err) {
        console.error("Release Escrow Error:", err);
        res.status(500).json({ message: "Server error releasing escrow payment." });
    }
});

module.exports = router;
