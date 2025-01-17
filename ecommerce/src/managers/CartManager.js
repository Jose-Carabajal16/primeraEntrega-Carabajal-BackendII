import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.model.js";

export default class CartManager {
    #carts;

    constructor() {
        this.#carts = CartModel;
    }

    //Busca un carrito por su ID
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }
        const cartFound = await this.#carts.findById(id).populate("products.product");

        if (!cartFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cartFound;
    }

    //Obtiene una lista de carritos
    async getAll(params) {
        try {
            const paginationOptions = {
                limit: params?.limit || 10, 
                page: params?.page || 1, 
                populate: "products.product", 
                lean: true,
            };

            return await this.#carts.paginate({}, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    //Obtiene un carrito específico por su ID
    async getOneById(id) {
        try {
            const cartFound = await this.#findOneById(id);
            return cartFound;
        } catch (error) {
            throw ErrorManager.handleError(error); 
        }
    }

    //Inserta un nuevo carrito
    async insertOne(data) {
        try {
            const cart = await this.#carts.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    //Agrega un producto a un carrito o incrementa la cantidad de un producto existente
    async addOneProduct(id, productId, quantity = 1) {
        if (quantity <= 0) {
            throw new ErrorManager("La cantidad debe ser mayor que cero.", 400);
        }

        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity; 
            } else {
                cart.products.push({ product: productId, quantity }); 
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    //Actualiza la cantidad de un producto en el carrito
    async updateProductQuantity(id, productId, quantity) {

        if (quantity <= 0) {
            throw new ErrorManager("La cantidad debe ser mayor que cero.", 400);
        }

        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex === -1) {
                throw new ErrorManager("Producto no encontrado en el carrito", 404);
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    //Elimina un producto del carrito
    async removeProduct(id, productId) {
        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex === -1) {
                throw new ErrorManager("Producto no encontrado en el carrito", 404);
            }

            cart.products.splice(productIndex, 1); 
            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
    //Elimina todos los productos de un carrito
async removeAllProductsFromCart(cartId) {
    try {
        const cart = await this.#findOneById(cartId);
        // cart.products = [];
        await cart.save();

        return cart;
    } catch (error) {
        throw new ErrorManager(error.message, error.code);
    }
}

    
}
