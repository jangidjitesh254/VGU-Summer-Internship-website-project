const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productTitle: { type: String, required: true },
    productImage: { type: String, default: "" },
    amount: { type: Number, required: true },
    buyerEmail: { type: String, required: true },
    buyerName: { type: String, default: "Buyer" },
    sellerEmail: { type: String, required: true },
    sellerName: { type: String, default: "Seller" },
    type: { type: String, enum: ["Escrow Purchase", "Price Offer"], default: "Escrow Purchase" },
    status: { type: String, enum: ["Held in Escrow", "Released", "Pending Offer", "Accepted", "Declined"], default: "Held in Escrow" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
