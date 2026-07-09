// let APIURL = "https://dummyjson.com/products/search?q="


// let productsData = [];

// const button = document.getElementById("Searchbtn");

// button.addEventListener("click", () => {
//     const product = document.getElementById("Product").value;

//     fetch(APIURL + product)
//         .then((res) => {
//             return res.json();


//         })
//         .then((data) => {
//             console.log(data)
//             productsData = data.products;

//             const productList = document.querySelector(".products-list");
//             if (product === "") {
//                 alert("Please enter a product name.");
//                 return;
//             }

//             productList.innerHTML = "";

//             data.products.forEach(product => {
//                 console.log(product);
                

//                 const brand = document.createElement("h2");
//                 brand.innerText = "Brand : " + product.brand;

//                 const title = document.createElement("h3");
//                 title.innerText = "Name : " + product.title;

//                 const price = document.createElement("h3");
//                 price.innerText = "price : " + product.price;

//                 const image = document.createElement("img");
//                 image.src = product.images[0];
//                 image.width = 150;


//                 const card = document.createElement("div");
//                 card.classList.add("product-card");

//                 card.append(image);
//                 card.append(title);
//                 card.append(brand);
//                 card.append(price);

//                 productList.append(card);

//             });


//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })


// const sortbtn = document.getElementById("sortbtn");
// sortbtn.addEventListener("click", () => {

//     if (productsData.length === 0) {
//         alert("Search products first.");
//         return;
//     }

    
//     productsData.sort((a, b) => a.price - b.price);

//     const productList = document.querySelector(".products-list");
//     productList.innerHTML = "";

//     productsData.forEach(product => {

//         const brand = document.createElement("h2");
//         brand.innerText = "Brand : " + product.brand;

//         const title = document.createElement("h3");
//         title.innerText = "Name : " + product.title;

//         const price = document.createElement("h3");
//         price.innerText = "Price : " + product.price;

//         const image = document.createElement("img");
//         image.src = product.images[0];
//         image.width = 150;

//         const card = document.createElement("div");
//         card.classList.add("product-card");

//         card.append(image);
//         card.append(title);
//         card.append(brand);
//         card.append(price);

//         productList.append(card);
//     });
// });


let APIURL = "https://dummyjson.com/products/search?q=";

let productsData = [];

const button = document.getElementById("Searchbtn");


function displayProducts() {
    const productList = document.querySelector(".products-list");
    productList.innerHTML = "";

    productsData.forEach((product) => {

        const brand = document.createElement("h2");
        brand.innerText = "Brand : " + product.brand;

        const title = document.createElement("h3");
        title.innerText = "Name : " + product.title;

        const price = document.createElement("h3");
        price.innerText = "Price : $" + product.price;

        const image = document.createElement("img");
        image.src = product.images[0];
        image.width = 150;

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.append(image);
        card.append(title);
        card.append(brand);
        card.append(price);

        productList.append(card);
    });
}

button.addEventListener("click", () => {

    const product = document.getElementById("Product").value;

    if (product == "") {
        alert("Please enter a product name.");
        return;
    }

    fetch(APIURL + product)
        .then((res) => res.json())
        .then((data) => {

            console.log(data);

            productsData = data.products;

            displayProducts();
        })
        .catch((err) => {
            console.log(err);
        });

});


const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", () => {


    const sortValue = sortSelect.value;

    if (sortValue === "asc") {

        productsData.sort((a, b) => a.price - b.price);

    } else if (sortValue === "desc") {

        productsData.sort((a, b) => b.price - a.price);

    }else if (sortValue === "desc-r") {

        productsData.sort((a, b) => b.rating - a.rating);

    }else if (sortValue === "asc-r") {

        productsData.sort((a, b) => a.rating - b.rating);
    }
    displayProducts();
});
