const express = require('express')
const mongoose = require('mongoose')
const app = express();
const methodOverride = require("method-override");

mongoose.connect("mongodb://127.0.0.1:27017/data")
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => console.log(err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    desc: String
});

const Product = mongoose.model("products",productSchema);

//Insert
Product.insertMany([
    {
        
        name:'Phone',
        image:"https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:100,
        desc:" a portable, handheld device that connects to wireless networks via radio waves to facilitate voice calls, text messaging, and internet access"
    },
    {
        
        name:'laptop',
        image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:150,
        desc:" a portable, handheld device that connects to wireless networks via radio waves to facilitate voice calls, text messaging, and internet access"
    },
    {
        
        name:'Drone',
        image:"https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:70,
        desc:" a portable, handheld device that connects to wireless networks via radio waves to facilitate voice calls, text messaging, and internet access"
    },
    {
        
        name:'keyboard',
        image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:30,
        desc:" a portable, handheld device that connects to wireless networks via radio waves to facilitate voice calls, text messaging, and internet access"
    }
])
.then(()=>{
    console.log("created successfully")
})
.catch((err)=>{
    console.log(err);
})


app.set("view engine" ,"ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));




app.get("/", (req,res)=>{
    res.render("home");
})

app.get("/products", async (req,res)=>{
    const products = await Product.find();
    res.render("products" , {products});
})

app.get("/products/new", (req, res) => {

    res.render("new");
});

app.post("/products", async (req, res) => {

    // const { name, price, image } = req.body;

    // const product = {
    //     id: products.length + 1,
    //     name,
    //     price,
    //     image
    // };

    // products.push(product);
     await Product.create(req.body);

    res.redirect("/products");
});

app.get("/products/:id", async (req, res) => {

    // const { id } = req.params;

    // const product = products.find(item => item.id == id);
    const product = await Product.findById(req.params.id);

    res.render("show", { product });

});

app.get("/products/:id/edit", async (req, res) => {

    // const { id } = req.params;

    // const product = products.find(item => item.id == id);

    const product = await Product.findById(req.params.id);


    res.render("edit", { product });

});

// app.post("/products/:id/edit",(req,res)=>{
//     const {id} = req.params;
//     const product = products.find((item)=> item.id == id) 
//     product.name = req.body.name;
//     product.price = Number(req.body.price);
//     product.image = req.body.image;
//     product.desc = req.body.desc;

//     res.redirect("/products");

// })

app.put("/products/:id", async (req, res) => {

    const { id } = req.params;

    // const product = products.find(item => item.id == id);

    // const { name, image, price, desc } = req.body;

    // product.name = name;
    // product.price = price;
    // product.image = image;
    // product.desc = desc;
     await Product.findByIdAndUpdate(
        req.params.id,
        req.body
    );

    res.redirect("/products");

});

app.delete("/products/:id", async (req,res)=>{
    // const { id } = req.params;

    // const index = products.findIndex(item => item.id == id);

    // products.splice(index,1);
    
    await Product.findByIdAndDelete(req.params.id);

    res.redirect("/products");
})

app.listen(3000, () => {
    console.log("Server running");
});



