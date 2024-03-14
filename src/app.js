const express = require('express');
const app = express();

const { ProductManager, Product } = require('./ProductManager');

// Persistency file path
const pathToFile = 'C:/Backend/ProductManager_Backend/src/persistenceFile.json';
const pManager = new ProductManager(pathToFile);

app.get('/products', async (req, res) => {
    const limit = Number(req.query.limit);
    let products = await pManager.getProducts();
    products = products.slice(0, limit);
    res.send(products);
});

app.get('/products/:pid', async (req, res) => {
    const pid = Number(req.params.pid);
    const product = await pManager.getProductById(pid);
    res.send(product);
});

app.listen(8080, () => {
    console.log(`Express Server running on port 8080`);
});