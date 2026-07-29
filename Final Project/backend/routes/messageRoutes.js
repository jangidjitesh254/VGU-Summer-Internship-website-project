const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// Post a new message
router.post("/", async (req, res) => {
    try {
        const { productId, productTitle, senderEmail, senderName, receiverEmail, receiverName, text } = req.body;
        if (!senderEmail || !receiverEmail || !text) {
            return res.status(400).json({ message: "Sender, receiver, and text are required." });
        }

        const message = await Message.create({
            productId: productId || "general",
            productTitle: productTitle || "Campus Item",
            senderEmail: senderEmail.toLowerCase().trim(),
            senderName: senderName || "Student",
            receiverEmail: receiverEmail.toLowerCase().trim(),
            receiverName: receiverName || "Student",
            text
        });

        res.status(201).json(message);
    } catch (err) {
        console.error("Message Error:", err);
        res.status(500).json({ message: "Server error sending message." });
    }
});

// Fetch all active conversation threads for a user
router.get("/", async (req, res) => {
    try {
        const email = req.query.email ? req.query.email.toLowerCase().trim() : null;
        if (!email) {
            return res.status(400).json({ message: "Email query param required." });
        }

        const messages = await Message.find({
            $or: [{ senderEmail: email }, { receiverEmail: email }]
        }).sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        console.error("Fetch Messages Error:", err);
        res.status(500).json({ message: "Server error fetching messages." });
    }
});

// Fetch specific product chat thread
router.get("/thread", async (req, res) => {
    try {
        const { productId, user1, user2 } = req.query;
        if (!productId || !user1 || !user2) {
            return res.status(400).json({ message: "productId, user1, and user2 required." });
        }

        const u1 = user1.toLowerCase().trim();
        const u2 = user2.toLowerCase().trim();

        const threadMessages = await Message.find({
            productId,
            $or: [
                { senderEmail: u1, receiverEmail: u2 },
                { senderEmail: u2, receiverEmail: u1 }
            ]
        }).sort({ createdAt: 1 });

        res.json(threadMessages);
    } catch (err) {
        console.error("Fetch Thread Error:", err);
        res.status(500).json({ message: "Server error fetching thread." });
    }
});

module.exports = router;
