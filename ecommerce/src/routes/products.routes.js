import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import uploader from "../utils/uploader.js";


const router = Router();
const productManager = new ProductManager();




router.get("/", async(req, res)=>{
    try {
        const products = await productManager.getAll(req.query)
        res.status(200).json({ status: "success", payload: products})
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message})
        
    }
})
router.get("/:id", async(req, res)=>{
    try {
        const product = await productManager.getOneById(req.params?.id)
        res.status(200).json({ status: "success", payload: product})
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message})
        
    }
})
router.post("/", async (req, res) => {
    try {

        await new Promise((resolve, reject) => {
            uploader.single("thumbnail")(req, res, (err) => {
                if (err) return reject(err); 
                resolve(); 
            });
        });

        console.log(req.body); 
        console.log(req.file); 


        const product = await productManager.insertOne(req.body, req.file);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        //Manejo de errores
        res.status(400).json({ status: "error", message: error.message });
    }
});
router.put("/:id", async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            uploader.single("thumbnail")(req, res, (err) => {
                if (err) return reject(err);
                resolve(); 
            });
        });
        console.log("req.body:", req.body);  
        console.log("req.file:", req.file); 

        const product = await productManager.updateOneById(req.params?.id, req.body, req.file);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});



router.delete("/:id", async(req, res)=>{
    try {
        const product = await productManager.deleteOneById(req.params?.id)
        res.status(200).json({ status: "success", payload: product})
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message})
        
    }
})

export default router