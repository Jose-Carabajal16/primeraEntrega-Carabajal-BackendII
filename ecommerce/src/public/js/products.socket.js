const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message");

socket.on("products-list", (data) => {
    const products = data.products ?? [];
    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title}</li>`;
    });
});

productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";

    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        category: formData.get("category"),
        status: formData.get("status") === "on" ? true : false,
    };

    // Validar que todos los campos estén completos
    if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category) {
        errorMessage.innerText = "Todos los campos son obligatorios.";
        return;
    }

    if (isNaN(data.price) || data.price <= 0) {
        errorMessage.innerText = "El precio debe ser un número positivo.";
        return;
    }

    if (isNaN(data.stock) || data.stock < 0) {
        errorMessage.innerText = "El stock debe ser un número no negativo.";
        return;
    }

    form.reset();

    socket.emit("insert-product", data);
};


btnDeleteProduct.onclick = () => {
    const id = Number(inputProductId.value);
    inputProductId.value = "";
    errorMessage.innerText = "";

    if (id > 0) {
        socket.emit("delete-product", { id });
    }
};

socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});