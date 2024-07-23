const express = require('express');
const fs = require('fs');
const router = express.Router();

const filePath = './data/products.json';

// Función para leer los productos desde el archivo
const getProducts = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return [];
};

// Función para escribir los productos al archivo
const saveProducts = (products) => {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

// Generar un nuevo ID para el producto
const generateId = (products) => {
    const ids = products.map(product => product.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

// Ruta raíz GET / (Listar todos los productos)
router.get('/', (req, res) => {
    const products = getProducts();
    res.json(products);
});

// Ruta GET /:pid (Traer producto por ID)
router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id == req.params.pid);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Ruta raíz POST / (Agregar un nuevo producto)
router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || typeof price !== 'number' || typeof status !== 'boolean' || typeof stock !== 'number' || !category || !Array.isArray(thumbnails)) {
        return res.status(400).json({ error: 'Missing required fields or incorrect data format' });
    }

    const products = getProducts();
    const newProduct = {
        id: generateId(products),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
});

// Ruta PUT /:pid (Actualizar producto por ID)
router.put('/:pid', (req, res) => {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id == req.params.pid);

    if (productIndex !== -1) {
        const updatedProduct = {
            ...products[productIndex],
            ...req.body,
            id: products[productIndex].id // Asegurarse de que el ID no cambie
        };
        products[productIndex] = updatedProduct;
        saveProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Ruta DELETE /:pid (Eliminar producto por ID)
router.delete('/:pid', (req, res) => {
    let products = getProducts();
    const productIndex = products.findIndex(p => p.id == req.params.pid);

    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1)[0];
        saveProducts(products);
        res.status(200).json({ message: `Product with id ${deletedProduct.id} deleted successfully` });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

module.exports = router;
