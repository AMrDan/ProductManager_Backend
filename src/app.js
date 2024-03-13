// const express = import('express');
// const app = express();

const { ProductManager, Product } = require('./ProductManager');

// Caminho para o arquivo de persistência
const pathToFile = './../src/persistenceFile.json';

// Cria uma instância de ProductManager
const pManager = new ProductManager(pathToFile);

// Exibe os produtos
console.log(pManager.getProducts());

// Deleta um produto (você precisa passar o id do produto que deseja deletar)
pManager.deleteProduct(1); // Deleta o produto com id 1

// Atualiza um produto (você precisa passar o id do produto que deseja atualizar e o novo objeto do produto)
const updatedProduct = new Product("Prod2 Novo", "Descrição Prod 2 Novo", 40.00, "caminho/thimb2Novo.jpg", "2", 3);
pManager.updateProduct(2, updatedProduct); // Atualiza o produto com id 2

