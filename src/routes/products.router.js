import {Router} from 'express';

const router = Router();

const { ProductManager, Product } = require('./ProductManager');

// Persistency file path
const pathToFile = 'C:/Backend/ProductManager_Backend/src/produtos.json';
const pManager = new ProductManager(pathToFile);

router.get('/products', async (req, res) => {
    let products = await pManager.getProducts();

    let limit = req.query.limit;
    if(limit){
        products = products.slice(0, Number(limit));
    }
    
    res.send(products);
});

router.get('/products/:pid', async (req, res) => {
    const pid = Number(req.params.pid);
    const product = await pManager.getProductById(pid);
    res.send(product);
});
export default router;