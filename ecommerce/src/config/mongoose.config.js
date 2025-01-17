import { connect, Types } from "mongoose";


export const connectDB = async () => {
    const URL = "mongodb+srv://josecarabajal16:rufina2020@cluster0.l1u1c.mongodb.net/proyecoFinal-Prueba"

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB", error.message);
    }
};


export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};