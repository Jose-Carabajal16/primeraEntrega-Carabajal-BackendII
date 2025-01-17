import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";

// Configuración y utilidades
import paths from "./utils/paths.js";
import { connectDB } from "./config/mongoose.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { initializePassport } from "./config/passport.config.js";

// Rutas
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import routerProducts from "./routes/products.routes.js";
import routerCarts from "./routes/carts.routes.js";
import routerViewHome from "./routes/home.view.routes.js";

// Crear instancia de la aplicación Express
const app = express();

// Conexión a la base de datos
connectDB();

// Configuración del puerto
const PORT = 5000;

// Middlewares globales
app.use(express.urlencoded({ extended: true })); // Formularios codificados en URL
app.use(express.json()); // Contenido JSON
app.use(cookieParser());

// Inicializar Passport
initializePassport();

// Configuración del motor de plantillas Handlebars
configHandlebars(app);

// Archivos estáticos
app.use("/api/public", express.static(paths.public));

// Rutas principales
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/", routerViewHome);
app.use("/api/auth", authRouter);
app.use(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  userRouter
);

// Manejo de rutas inexistentes
app.use("*", (req, res) => {
  res.status(404).render("error404", { title: "Error 404" });
});

// Iniciar el servidor
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Configuración del servidor de WebSocket
configWebsocket(httpServer);
