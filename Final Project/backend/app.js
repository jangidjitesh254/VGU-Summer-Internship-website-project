const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ReUse")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch(err=>{
    console.log(err);
});

const productRoutes = require("./routes/productRoutes");

app.use("/products", productRoutes);

app.listen(5000, () => {
    console.log("Server Running");
});