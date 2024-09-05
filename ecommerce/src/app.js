import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import routes from "./routes/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const app = express();


app.engine('handlebars', engine({
  extname: 'handlebars',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const mongoUri = 'mongodb://localhost:27017/coderBack';

mongoose.connect(mongoUri)
.then(() => console.log('Conectado a la base de datos'))
.catch((error) => console.error('Error al conectar a la base de datos:', error));

// Rutas
app.use("/api", routes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

export default app;
