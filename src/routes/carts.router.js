import { Router } from 'express';
import { CartManager } from '../controller/CartManager.js';

const router = Router();

// Persistency file path
const cartFilePath = './src/carrito.json';
const cManager = new CartManager(cartFilePath);

router.get('/', async (req, res) => {
    let carts = await cManager.getCarts();
    let limit = req.query.limit;
    if(limit){
        carts = carts.slice(0, Number(limit));
    }
    res.send(carts);
});

router.get('/:cid', async (req, res) => {
    const cId = Number(req.params.cid);
    const response = await cManager.getCartById(cId);
    res.send(response.message);
});

router.post('/', async (req, res) => {
    const response = await cManager.addCart(req.body);
    res.send(response.message);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const response = await cManager.addProductToCart(cid, pid);
    res.send(response.message);
});

export default router;