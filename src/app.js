//socket del lado del servidor
import express from "express";
import { productRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/carts.routes.js";
import { Server } from "socket.io";  // !2.
import handlebars from "express-handlebars"; // !4.
import { __dirname } from "./utils.js";  //? 1.
import path from "path";
import { ProductManager } from "./managers/ProductManager.js";

//configuracion del servidor http
const app = express();
const port = 8080;

//middlewares
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"/public")));
console.log(path.join(__dirname,"/public"));
//!Servidor http
const httpServer=app.listen(port,()=>console.log(`Server on listening on port ${port}`));  //! 1.

//!Servidor de websocket
const socketServer = new Server(httpServer); //! 3.

//!configuracion del motor de plantillas
app.engine('.handlebars', handlebars.engine({extname: '.handlebars'})); 
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname,"/views"));


//routes

//app.use("/api/products",productRouter);
app.use(productRouter);
app.use("/api/carts",cartRouter);


const productManager = new ProductManager("products.json");

socketServer.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  // Obtener los productos y emitir el evento "products" al cliente
  const getProducts = async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit("products", products);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Llamar a la función para obtener los productos cuando se conecta un cliente
  getProducts();

  socket.on("addProduct", async (product) => {
    try {
      const addedProduct = await productManager.addProduct(product);
      socketServer.emit("productAdded", addedProduct);
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      socketServer.emit("productDeleted", productId);
    } catch (error) {
      console.log(error.message);
    }
  });
});
