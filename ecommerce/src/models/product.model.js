import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "El título es obligatorio"],
            trim: true,
            minLength: [3, "El título debe tener al menos 3 caracteres"],
            maxLength: [50, "El título debe tener como máximo 50 caracteres"],
        },
        description: {
            type: String,
            required: [true, "La descripción es obligatoria"],
            trim: true,
            maxLength: [200, "La descripción debe tener como máximo 200 caracteres"],
        },
        code: {
            type: String,
            required: [true, "El código es obligatorio"],
            unique: true,
            trim: true,
            minLength: [3, "El código debe tener al menos 3 caracteres"],
            maxLength: [20, "El código debe tener como máximo 20 caracteres"],
        },
        price: {
            type: Number,
            required: [true, "El precio es obligatorio"],
            min: [0.01, "El precio debe ser un valor positivo mayor a 0"],
        },
        status: {
            type: Boolean,
            required: [true, "El estado es obligatorio"],
            default: true,
        },
        stock: {
            type: Number,
            required: [true, "El stock es obligatorio"],
            min: [0, "El stock debe ser un valor no negativo"],
        },
        category: {
            type: String,
            required: [true, "La categoría es obligatoria"],
            trim: true,
            maxLength: [30, "La categoría debe tener como máximo 30 caracteres"],
        },
        thumbnail: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, 
        versionKey: false, 
    }
);

productSchema.plugin(paginate);

const Product = model("products", productSchema);

export default Product;
