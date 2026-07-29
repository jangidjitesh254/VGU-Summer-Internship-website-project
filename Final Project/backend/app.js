const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ReUse")
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.log("MongoDB Connection Error:", err);
});

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const Message = require("./models/message");

app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/transactions", transactionRoutes);

// Socket.io Real-Time In-App Messaging
io.on("connection", (socket) => {
    console.log("Client connected to Socket.io:", socket.id);

    // Join chat room
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle real-time messaging
    socket.on("send_message", async (data) => {
        try {
            const { roomId, productId, productTitle, senderEmail, senderName, receiverEmail, receiverName, text } = data;

            if (senderEmail && receiverEmail && text) {
                // Save to MongoDB database
                const newMessage = await Message.create({
                    productId: productId || "general",
                    productTitle: productTitle || "Campus Item",
                    senderEmail: senderEmail.toLowerCase().trim(),
                    senderName: senderName || "Student",
                    receiverEmail: receiverEmail.toLowerCase().trim(),
                    receiverName: receiverName || "Student",
                    text
                });

                // Emit real-time message to room
                io.to(roomId).emit("receive_message", newMessage);
            }
        } catch (err) {
            console.error("Socket send_message error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

server.listen(5000, () => {
    console.log("Server Running on port 5000 with Socket.io enabled");
});