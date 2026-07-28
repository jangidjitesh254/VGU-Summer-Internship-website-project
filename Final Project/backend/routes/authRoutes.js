const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Login Endpoint - Require Prior Registration
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // User does not exist -> Return 404 error instructing user to register first
            return res.status(404).json({
                message: "User does not exist. Please register first!",
                notRegistered: true
            });
        }

        // User exists -> verify password
        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password. Please check your credentials." });
        }

        return res.json({
            message: "Login successful! Welcome back.",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone
            }
        });
    } catch (err) {
        console.error("Auth Login Error:", err);
        return res.status(500).json({ message: "Server error during authentication." });
    }
});

// Register Endpoint
router.post("/register", async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            return res.status(400).json({ message: "An account with this email already exists. Please login instead." });
        }

        user = await User.create({
            email: normalizedEmail,
            password,
            firstName: firstName ? firstName.trim() : normalizedEmail.split('@')[0],
            lastName: lastName ? lastName.trim() : "",
            phone: phone ? phone.trim() : ""
        });

        return res.status(201).json({
            message: "Account registered successfully!",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone
            }
        });
    } catch (err) {
        console.error("Auth Register Error:", err);
        return res.status(500).json({ message: "Server error during registration." });
    }
});

module.exports = router;
