import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express();

app.listen(8080, () => {
    console.log(`Express Server running on port 8080`);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// ----------------  JIC you need to add products ----------------
// import {ProductManager, Product} from './ProductManager.js'
// // Persistency file path
// const pathToFile = 'C:/Backend/ProductManager_Backend/src/produtos.json';
// const pManager = new ProductManager(pathToFile);

// const prod1 = new Product(
//     "Prod1", // title
//     "Descrição Prod 1", // description
//     "1", // code
//     10.0, // price
//     true, // status
//     1, // stock
//     "Categoria 1", // category
//     ["caminho/thumb1.jpg"] // thumbnails
// );

// const prod2 = new Product(
//     "Prod2", // title
//     "Descrição Prod 2", // description
//     "2", // code
//     20.0, // price
//     true, // status
//     2, // stock
//     "Categoria 2", // category
//     ["caminho/thimb2.jpg"] // thumbnails
// );

// const prod3 = new Product(
//     "Prod3", // title
//     "Descrição Prod 3", // description
//     "3", // code
//     30.0, // price
//     true, // status
//     3, // stock
//     "Categoria 3", // category
//     ["caminho/thimb3.jpg"] // thumbnails
// );
// await pManager.addProduct(prod1);
// await pManager.addProduct(prod2);
// await pManager.addProduct(prod3);
// ---------------- End of: JIC you need to add products ----------------