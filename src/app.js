import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const express = require('express');
const app = express();

app.listen(8080, () => {
    console.log(`Express Server running on port 8080`);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);