const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    title: String,

    price: Number,

    category: String,

    condition: String,

    description: String,

    image: String

});

module.exports = mongoose.model("Product", productSchema);

