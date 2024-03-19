import {Router} from 'express';
import { ProductManager } from './../ProductManager.js';

const router = Router();

// Persistency file path
const productsFilePath = 'C:/Backend/ProductManager_Backend/src/produtos.json';
const pManager = new ProductManager(productsFilePath);

router.get('/', async (req, res) => {
    let products = await pManager.getProducts();

    let limit = req.query.limit;
    if(limit){
        products = products.slice(0, Number(limit));
    }
    
    res.send(products);
});

router.get('/:pid', async (req, res) => {
    const pid = Number(req.params.pid);
    const product = await pManager.getProductById(pid);
    res.send(product);
});

// router.post('', async (req, res)) => {
    

// }

export default router;