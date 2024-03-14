const express = require('express');
const app = express();

const { ProductManager, Product } = require('./ProductManager');

// Persistency file path
const pathToFile = 'C:/Backend/ProductManager_Backend/src/persistenceFile.json';
const pManager = new ProductManager(pathToFile);

app.get('/products', (req, res) => {
    const limit = Number(req.query.limit);
    const products = pManager.getProducts().slice(0, limit);
    res.send(products);
});

app.get('/products/:pid', (req, res) => {
    const pid = Number(req.params.pid);
    const product = pManager.getProductById(pid);
    res.send(product);
});

app.listen(8080, () => {
    console.log(`Express Server running on port 8080`);
});