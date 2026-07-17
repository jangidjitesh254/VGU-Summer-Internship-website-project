const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const Products = require("./models/products");
const path = require("path");

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/VGU-Ecom")
    .then(()=>{
        console.log("DB conected")
    })
    .catch(()=>{
        console.log("DB not conected")
    })

app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/products",async (req,res)=>{
    const products = await Products.find({});
    // console.log(products)
    res.render("index",{products})
})

app.get("/product/new",(req,res)=>{
    res.render("new")
})

app.post("/products",async (req,res)=>{
    const {name,image,price,desc} = req.body;
    await Products.create({name,image,price,desc});
    res.redirect("/products")
})

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    // const product = await Products.findOne({ _id: id })
    const product = await Products.findById(id);
    res.render("show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
    const { id } = req.params;
    const product = await Products.findById(id);
    res.render("edit", { product });
});

app.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, image, price, desc } = req.body;

    await Products.findByIdAndUpdate(id, {name,image,price,desc });

    res.redirect("/products");
});

app.delete("/products/:id", async (req,res)=>{
    const id = req.params.id;    
    await Product.findByIdAndDelete(id);

    res.redirect("/products");
})

const PORT = 4000;
app.listen(PORT,()=>{
    console.log("Server run at port",PORT)
})