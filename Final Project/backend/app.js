const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const router = express.Router();

const Product = require("./models/product");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/ReUse")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch(err=>{
    console.log(err);
});

const productRoutes = require("./routes/productRoutes");

app.use("/products", productRoutes);



app.listen(process.env.PORT,()=>{
    console.log("Server Started");
});