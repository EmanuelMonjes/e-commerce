const express = require('express');
const fs = require('fs');
const router = express.Router();

const filePath = './data/carts.json';

// Función para leer los carritos desde el archivo
const getCarts = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return [];
};

// Función para escribir los carritos al archivo
const saveCarts = (carts) => {
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));
};

// Generar un nuevo ID para el carrito
const generateId = (carts) => {
    const ids = carts.map(cart => cart.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

// Ruta raíz POST / (Crear un nuevo carrito)
router.post('/', (req, res) => {
    const carts = getCarts();
    const newCart = {
        id: generateId(carts),
        products: []
    };

    carts.push(newCart);
    saveCarts(carts);

    res.status(201).json(newCart);
});

// Ruta GET /:cid (Listar productos en el carrito por ID de carrito)
router.get('/:cid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id == req.params.cid);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Ruta POST /:cid/product/:pid (Agregar producto al carrito)
router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id == req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.product == req.params.pid);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    saveCarts(carts);
    res.json(cart);
});

module.exports = router;
