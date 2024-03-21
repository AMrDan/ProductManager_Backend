import Persistence from '../Utils/Persistence.js'
import { ProductManager } from './ProductManager.js';

export class CartManager {
  #path;
  #db;
  #pManager;

  constructor(path)
  {
    this.#path = path;
    this.#db = new Persistence(this.#path);
    this.#pManager = new ProductManager(this.#path);
  }

  async addCart(newCart) {
    let message = '';

    // Add the new product
    let cartsArray = await this.getCarts();
    const newId = this.createId(cartsArray);
    newCart.id = newId;

    cartsArray.push(newCart);
    cartsArray = JSON.stringify(cartsArray);

    const response = await this.#db.write(cartsArray);
    if(response.status){
      message = `Carrinho de ID "${newCart.id}" criado com sucesso!`;
    }else{
      message = `Erro ao criar o carrinho de ID "${newCart.id}". Erro: ${response.message}`;
    }
    return {status: response.status, message: message};
  }

  async addProductToCart(cartId, productId) {
    let message = '';

    // Check if cart exists
    let cartExists = await this.getCartById(cartId);
    if(!cartExists.status){
      return cartExists; // Return object with status and message with error.
    }

    // Check if product exists
    let productExists = await this.#pManager.getProductById(productId);
    if(!productExists.status){
      return productExists; // Return object with status and message with error.
    }

    let cartsArray = await this.getCarts();
    for(let cart of cartsArray){
      if(cart.id === cartId){
        const productExists = cart.products.find(p => p.productId === productId);
        if(productExists){
          cart.products.forEach((p) => {
            if(p.productId === productId){
              p.quantidade++;
            }
          });
        }else{
          const newProduct = new CartProduct(productId, 1);
          cart.products.push(newProduct);
        }
        break;  
      }
    }

    cartsArray = JSON.stringify(cartsArray);

    const response = await this.#db.write(cartsArray);
    if(response.status){
      message = `Produto de ID "${productId}" adicionado ao carrinho de ID "${cartId}" com sucesso!`;
    }else{
      message = `Erro ao adicionar o produto de ID "${productId}" ao carrinho de ID "${cartId}". Erro: ${response.message}`;
    }
    return {status: response.status, message: message};
  }

  async getCarts(){
    let cartsArray = await this.#db.read();
    if(cartsArray.length === 0) 
      return [];
    return JSON.parse(cartsArray);
  }

  async getCartById(id) {
    let status = false;
    let message = '';

    const carts = await this.getCarts();
    const result = carts.find((cart) => cart.id === id);
    if(result){
      status = true;
      message = result;
    }else{
      status = false;
      message = `Carrinho com Id "${id}" não encontrado.`;
    }

    return {status: status, message: message};
  }

  createId(cartsList){
    let maxValue = Number.MIN_SAFE_INTEGER;
    try {
      cartsList.forEach((cart) => {
        if(cart.id > maxValue)
        maxValue = cart.id;
      });

      if(maxValue == Number.MIN_SAFE_INTEGER){
        maxValue = 0;
      }
    } catch (error) {
      maxValue = 0;
    }

    return maxValue + 1;
  }
}

export class Cart {
  constructor(products) {
    if(!Array.isArray(products)){
      products = [products];
    }
    this.products = products;
  }
}

export class CartProduct {
  constructor(productId, quantidade) {
    this.productId = productId;
    this.quantidade = quantidade;
  }
}