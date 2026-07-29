const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productTitle: { type: String, default: "Campus Product" },
    senderEmail: { type: String, required: true },
    senderName: { type: String, default: "Student" },
    receiverEmail: { type: String, required: true },
    receiverName: { type: String, default: "Seller" },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
