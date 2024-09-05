import { Server } from "socket.io";
import app from "./src/app.js";
import ProductController from "./src/controllers/productController-file.js";
 
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`App running in http://localhost:${PORT}`);
});

const io = new Server(server);

const productController = new ProductController();

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  productController._readFile().then((products) => {
    socket.emit("products", products);
  });

  socket.on('addProduct', async (product) => {
    await productController.addProductSocket(product);
  });

  socket.on('deleteProduct', async (productId) => {
    await productController.deleteProductSocket(productId);
  });
});