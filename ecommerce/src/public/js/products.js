const productsTableBody = document.getElementById("products-table-body");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const btnSortPriceAsc = document.getElementById("sort-price-asc");
const btnSortPriceDesc = document.getElementById("sort-price-desc");
const btnViewCart = document.getElementById("btn-view-cart");
const btnClearCart = document.getElementById("btn-clear-cart");

//Función para cargar la lista de productos en la tabla con ordenamiento
const loadProductsTable = async (sortOrder = "") => {
    try {
        const response = await fetch(`/api/products?sort=${sortOrder}`, { method: "GET" });
        const data = await response.json();
        const products = data.payload.docs ?? [];
        

        productsTableBody.innerHTML = "";
        

        products.forEach((product) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>
                    <button class="btn btn-success btn-sm add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                    </button>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                    <button class="btn btn-info btn-sm product-info" data-id="${product.id}">
                        <i class="fas fa-info-circle"></i> Información
                    </button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
        
        //  eventos a los botones de "Agregar al Carrito" y "Eliminar"
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", async (e) => {
                const productId = e.target.closest("button").dataset.id;
                await addProductToCart(productId);
            });
        });

        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", async (e) => {
                const productId = e.target.closest("button").dataset.id;
                await removeProductFromCart(productId);
            });
        });

        document.querySelectorAll(".product-info").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.closest("button").dataset.id;
                window.location.href = `/api/products/${productId}`;
            });
        });

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
};

//Función para agregar un producto al carrito
const addProductToCart = async (productId) => {
    try {
        const response = await fetch(`/api/carts/1/product/${productId}`, { method: "POST" });
        const data = await response.json();
        if (data.status === "success") {
            alert("Producto agregado al carrito.");
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
    }
};

//Función para eliminar un producto del carrito
const removeProductFromCart = async (productId) => {
    try {
        const response = await fetch(`/api/carts/1/product/${productId}`, { method: "DELETE" });
        const data = await response.json();
        if (data.status === "success") {
            alert("Producto eliminado del carrito.");
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
    }
};

//Evento para ordenar productos por precio
btnSortPriceAsc.addEventListener("click", () => loadProductsTable("asc"));
btnSortPriceDesc.addEventListener("click", () => loadProductsTable("desc"));

//Evento para ver el carrito
btnViewCart.addEventListener("click", () => {
    window.location.href = "/api/carts/1";
});

//Evento para vaciar el carrito
btnClearCart.addEventListener("click", async () => {
    try {
        const response = await fetch(`/api/carts/1`, { method: "DELETE" });
        const data = await response.json();
        if (data.status === "success") {
            alert("El carrito ha sido vaciado.");
        }
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
    }
});

//cargar la página
loadProductsTable();
