const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
        trim : true
    },
    price: {
        type : Number,
        required: true,
        min : 0
    },
    image: {
        type : String,
        required: true,
        trim : true
    },
    desc :{
        type : String,
        trim : true
    }
})
const Products = mongoose.model("Products",productSchema);
module.exports = Products;