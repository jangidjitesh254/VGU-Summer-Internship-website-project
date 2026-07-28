const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

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

app.use("/products", productRoutes);
app.use("/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server Running on port 5000");
});