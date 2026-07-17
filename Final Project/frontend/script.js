// LOGIN PAGE
const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        window.location.href = "dashboard.html";

    });

}

// DASHBOARD

const productContainer = document.getElementById("productContainer");

async function loadProducts() {

    if (!productContainer) return;

    try {

        const response = await fetch("http://localhost:5000/products");

        const products = await response.json();

        productContainer.innerHTML = "";

        products.forEach(product => {

            const card = document.createElement("div");

            card.className = "col-lg-3 col-md-6";

            card.innerHTML = `
                <div class="card product-card h-100">

                    <img src="${product.image}"
                        class="card-img-top"
                        alt="${product.title}">

                    <div class="card-body d-flex flex-column">

                        <h5 class="fw-bold">
                            ${product.title}
                        </h5>

                        <p class="text-muted mb-1">
                            ${product.category}
                        </p>

                        <p class="small">
                            <strong>Condition:</strong>
                            ${product.condition}
                        </p>

                        <h4 class="text-success">
                            ₹${product.price}
                        </h4>

                        <div class="mt-auto">

                            <a href="product.html?id=${product._id}"
                                class="btn btn-success w-100 mb-2">

                                View

                            </a>

                            <a href="editProduct.html?id=${product._id}"
                                class="btn btn-warning w-100 mb-2">

                                Edit

                            </a>

                            <button
                                class="btn btn-danger w-100"
                                onclick="deleteProduct('${product._id}')">

                                Delete

                            </button>

                        </div>

                    </div>

                </div>
            `;

            productContainer.appendChild(card);

        });

    }

    catch (error) {

        console.error("Error loading products:", error);

        productContainer.innerHTML = `
            <div class="col-12 text-center text-danger">
                Failed to load products.
            </div>
        `;

    }}

// DELETE PRODUCT


async function deleteProduct(id) {

    const confirmDelete = confirm("Delete this product?");

    if (!confirmDelete) return;

    try {

        await fetch(`http://localhost:5000/products/${id}`, {

            method: "DELETE"

        });

        loadProducts();

    }

    catch (error) {

        console.log(error);

    }

}


if (productContainer) {

    loadProducts();

}