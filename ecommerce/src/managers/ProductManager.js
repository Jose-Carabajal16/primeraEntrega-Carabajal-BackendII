import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";
import { convertToBoolean } from "../utils/converter.js";

export default class ProductManager {
    #product;

    constructor() {
        this.#product = ProductModel;
    }

    // Busca un producto por su ID
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const productFound = await this.#product.findById(id);

        if (!productFound) {
            throw new ErrorManager("Producto no encontrado", 404);
        }

        return productFound;
    }

    // Obtiene una lista de productos con filtros opcionales y paginación
    async getAll(params) {
        try {
            const $and = [];

            // Aplicar filtros si existen
            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
            if (params?.category) $and.push({ category: params.category });
            if (params?.price) $and.push({ price: Number(params.price) });
            if (params?.status !== undefined) $and.push({ status: convertToBoolean(params.status) });

            const filters = $and.length > 0 ? { $and } : {};


            const sort = {
                asc: { price: 1 },  
                desc: { price: -1 }, 
            };
            

            const paginationOptions = {
                limit: params?.limit || 10, 
                page: params?.page || 1, 
                sort: sort[params?.sort] || {}, 
                lean: true, 
            };

            return await this.#product.paginate(filters, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Obtiene un producto específico por su ID
    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Inserta un producto
    async insertOne(data) {
        try {
            const product = await this.#product.create({
                ...data,
                status: convertToBoolean(data.status),
            });

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Actualiza un producto por su ID
    async updateOneById(id, data) {
        try {
            const productFound = await this.#findOneById(id);

            const newValues = {
                ...productFound.toObject(), 
                ...data,
                status: data.status !== undefined ? convertToBoolean(data.status) : productFound.status,
            };

            productFound.set(newValues);
            await productFound.save();

            return productFound;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Elimina un producto por su ID
    async deleteOneById(id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}
