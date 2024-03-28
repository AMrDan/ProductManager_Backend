import { pManager } from './products.router.js';
const express = require('express');

const router = express.Router();

let allProducts = pManager.getProducts();

module.exports = router;