import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: "Hubo un problema al obtener los carritos." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params?.id);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: "Hubo un problema al obtener el carrito." });
    }
});


router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: "Hubo un problema al crear el carrito." });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body; 


        if (quantity <= 0) {
            return res.status(400).json({ status: "error", message: "La cantidad debe ser mayor a cero." });
        }

        //Agregar producto al carrito
        const cart = await cartManager.addOneProduct(cid, pid, quantity);

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado." });
        }

        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: "Hubo un problema al agregar el producto al carrito." });
    }
});

//Ruta PUT para actualizar la cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;


        if (!quantity) {
            return res.status(400).json({ status: "error", message: "Debe proporcionar la cantidad." });
        }

        const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: "Hubo un problema al actualizar la cantidad del producto." });
    }
});

// Ruta DELETE para eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.removeProduct(cid, pid);

        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: "Hubo un problema al eliminar el producto del carrito." });
    }
});
//Elimina todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.removeAllProductsFromCart(cid);

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado." });
        }

        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: "Hubo un problema al eliminar todos los productos del carrito." });
    }
});

export default router;
