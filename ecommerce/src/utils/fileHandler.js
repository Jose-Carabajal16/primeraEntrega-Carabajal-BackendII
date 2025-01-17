import fs from "fs"; //Este módulo permite realizar operaciones con archivos, como leer, escribir y eliminar.
import path from "path"; //Sirve para manejar y manipular rutas de archivos de forma segura y compatible con diferentes sistemas operativos.


//Comprueba que se proporcionen la ruta del archivo (filepath) y el nombre del archivo (filename) antes de realizar cualquier operación.
const validateFilePathAndName = (filepath, filename) => {
    if (!filepath) throw new Error("La ruta del archivo no fue proporcionada");
    if (!filename) throw new Error("El nombre del archivo no fue proporcionado");
}
// Lee el contenido de un archivo

//Lee un archivo JSON y devuelve su contenido convertido a un objeto o array.
export const readJsonFile = async (filepath, filename) => {
    validateFilePathAndName(filepath, filename) //Valida los parámetros filepath y filename usando la función explicada antes.
    try {
        const content = await fs.promises.readFile(path.join(filepath, filename), "utf-8")// genera la ruta completa del archivo
        return JSON.parse(content || "[]") //Convierte el texto JSON en un objeto o array usando JSON.parse y si el archivo esta vacio, devuelve un array vacio        
    } catch (error) {
        throw new Error("Error al leer el archivo");  
    }
}
//Escribe contenido en un archivo JSON, sobrescribiendo el archivo si ya existe.
export const writeJsonFile = async (filepath, filename, content) => {
    validateFilePathAndName(filepath, filename); //Valida la ruta y el nombre del archivo.
    if (!content) throw new Error("El contenido no fue proporcionada"); //Si content no tiene valor, lanza un error.
    try {
       /**Usa fs.promises.writeFile para escribir en el archivo.
        * JSON.stringify(content, null, "\t") convierte el contenido a texto JSON con formato legible (tabulación).
        */
        await fs.promises.writeFile(path.join(filepath, filename), JSON.stringify(content, null, "\t") , "utf-8")       
    } catch (error) {
        throw new Error("Error al escribir el archivo");  
    }
}
// Elimina un archivo en la ruta especificada.
export const deleteFile = async (filepath, filename) => {
    validateFilePathAndName(filepath, filename); //Valida la ruta y el nombre del archivo.

    try {
        await fs.promises.unlink(path.join(filepath, filename));
    } catch (error) {
        /** Si el error indica que el archivo no existe (ENOENT), muestra una advertencia*/
        if (error.code === "ENOENT") {
            console.warn(`El archivo ${filename} no existe.`);
        } else {
            throw new Error(`Error al eliminar el archivo ${filename}`);
        }
    }
};