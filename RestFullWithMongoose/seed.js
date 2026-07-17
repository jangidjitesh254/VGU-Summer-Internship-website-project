const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/VGU-Ecom")
    .then(()=>{
        console.log("DB conected")
    })
    .catch(()=>{
        console.log("DB not conected")
    })

const Products = require("./models/products");

const data = [
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
    },  
];

Products.create(data)
    .then(()=>{console.log("Product seeded to database")})