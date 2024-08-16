import { Server } from "socket.io";
import app from "./src/app.js";
import PManager from "./src/controllers/productManager.js";
 
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`App running in http://localhost:${PORT}`);
});

const io = new Server(server);

const pManager = new PManager();

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  pManager._readFile().then((products) => {
    socket.emit("products", products);
  });

  socket.on('addProduct', async (product) => {
    await pManager.addProductSocket(product);
  });

  socket.on('deleteProduct', async (productId) => {
    await pManager.deleteProductSocket(productId);
  });
});