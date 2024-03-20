import Persistence from '../Utils/Persistence.js'

export class CartManager {
  #path;
  #db;

  constructor(path)
  {
    this.#path = path;
    this.#db = new Persistence(this.#path);
  }

  async addCart(newCart) {
    let status = false;
    let message = '';
    // Validate that all fields are filled in
    let isRequiredFieldEmpty = this.isRequiredFieldEmpty(newCart);
    if(isRequiredFieldEmpty.status) 
      return isRequiredFieldEmpty;

    // Check if "code" is unique
    const isCodeDuplicated = await this.isCodeDuplicated(newCart);
    if(isCodeDuplicated.status)
      return isCodeDuplicated;

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

  async deleteCart(id){
    let message = '';
    
    let cartsArray = await this.getCarts();
    let responseCart = await this.getCartById(id);

    if(responseCart.status){
      const cartId = responseCart.message.id;

      let remainingCarts = cartsArray.filter((p) => p.id !== id);
      remainingCarts = JSON.stringify(remainingCarts);
      
      const responseDB = await this.#db.write(remainingCarts);
      if(responseDB.status){
        message = `O carrinho com ID "${cartId}" foi removido com sucesso!`;
      }else{
        message = `Erro ao remover o carrinho de ID "${cartId}". Erro: ${responseDB.message}`;
      }

      return {status: responseDB.status, message: message};
    }
  }

  async updateCart(id, updatedCart){
    let message = '';
    
    let cartsArray = await this.getCarts();
    const indexToUpdate = cartsArray.findIndex((cart) => cart.id === id);
    if(indexToUpdate === -1){
      message = `Carrinho com Id "${id}" não encontrado.`;
      return {status: false, message: message};
    }
    
    cartsArray[indexToUpdate].produto = updatedCart.produto;
    cartsArray[indexToUpdate].quantidade = updatedCart.quantidade;

    cartsArray = JSON.stringify(cartsArray);
    const response = await this.#db.write(cartsArray);

    if(response.status){
      message = `Carrinho com ID "${updatedCart.id}" atualizado com sucesso!`;
    }else{
      message = `Erro ao atualizar o carrinho de ID "${updatedCart.id}". Erro: ${response.message}`;
    }
    
    return {status: response.status, message: message};
  }

  // Check if "code" is unique
  async isCodeDuplicated(newProduct){
    let products = await this.getCarts();
    let codeIsDuplicated = false;
    let message = '';

    if(products){
      codeIsDuplicated = products.find(
        (existingProduct) => existingProduct.code === newProduct.code
      );

      if (codeIsDuplicated) {
        message = `Erro: O código "${newProduct.code}" já foi cadastrado.`;
      }
    }

    return {status: !!codeIsDuplicated, message: message}
  }

  // Validate that all fields are filled in
  isRequiredFieldEmpty(newCart){
    let status = false;
    let message = '';
    let emptyCart = new Cart();
    for (const field in emptyCart) {
      if (!newCart[field] && field !== 'thumbnails') {
        status = true;
        message = `Erro: O item "${field}" é obrigatório.`;
        break;
      }
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
  constructor(produto, quantidade) {
    this.produto = produto;
    this.quantidade = quantidade;
  }
}