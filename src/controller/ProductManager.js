import Persistence from '../Utils/Persistence.js'

export class ProductManager {
  #path;
  #db;

  constructor(path)
  {
    this.#path = path;
    this.#db = new Persistence(this.#path);
  }

  async addProduct(newProduct) {
    let status = false;
    let message = '';
    // Validate that all fields are filled in
    let isRequiredFieldEmpty = this.isRequiredFieldEmpty(newProduct);
    if(isRequiredFieldEmpty.status) 
      return isRequiredFieldEmpty;

    // Check if "code" is unique
    const isCodeDuplicated = await this.isCodeDuplicated(newProduct);
    if(isCodeDuplicated.status)
      return isCodeDuplicated;

    // Add the new product
    let productsArray = await this.getProducts();
    const newId = this.createId(productsArray);
    newProduct.id = newId;

    productsArray.push(newProduct);
    productsArray = JSON.stringify(productsArray);

    const response = await this.#db.write(productsArray);
    if(response.status){
      message = `Produto "${newProduct.title}" adicionado com sucesso!`;
    }else{
      message = `Erro ao inserir o Produto "${newProduct.title}". Erro: ${response.message}`;
    }
    return {status: response.status, message: message};
  }

  async getProducts(){
    let productsArray = await this.#db.read();
    if(productsArray.length === 0) 
      return [];
    return JSON.parse(productsArray);
  }

  async getProductById(id) {
    let status = false;
    let message = '';

    const products = await this.getProducts();
    const result = products.find((product) => product.id === id);
    if(result){
      status = true;
      message = result;
    }else{
      status = false;
      message = `Produto com Id "${id}" não encontrado.`;
    }

    return {status: status, message: message};
  }

  async deleteProduct(id){
    let message = '';
    
    let productsArray = await this.getProducts();
    let responseProduct = await this.getProductById(id);

    if(responseProduct.status){
      const productTitle = responseProduct.message.title;

      let remainingProducts = productsArray.filter((p) => p.id !== id);
      remainingProducts = JSON.stringify(remainingProducts);
      
      const responseDB = await this.#db.write(remainingProducts);
      if(responseDB.status){
        message = `Produto "${productTitle}" removido com sucesso!`;
      }else{
        message = `Erro ao remover produto. Erro: ${responseDB.message}`;
      }

      return {status: responseDB.status, message: message};
    }
  }

  async updateProduct(id, updatedProduct){
    let message = '';
    
    let productsArray = await this.getProducts();
    const indexToUpdate = productsArray.findIndex((p) => p.id === id);
    if(indexToUpdate === -1){
      message = `Produto com Id "${id}" não encontrado.`;
      return {status: false, message: message};
    }

    productsArray[indexToUpdate].title = updatedProduct.title;
    productsArray[indexToUpdate].description = updatedProduct.description;
    productsArray[indexToUpdate].code = updatedProduct.code;
    productsArray[indexToUpdate].price = updatedProduct.price;
    productsArray[indexToUpdate].status = updatedProduct.status;
    productsArray[indexToUpdate].stock = updatedProduct.stock;
    productsArray[indexToUpdate].category = updatedProduct.category;
    productsArray[indexToUpdate].thumbnails = updatedProduct.thumbnails;

    productsArray = JSON.stringify(productsArray);
    const response = await this.#db.write(productsArray);

    if(response.status){
      message = `Produto "${updatedProduct.title}" atualizado com sucesso!`;
    }else{
      message = `Erro ao atualizar o produto "${updatedProduct.title}". Erro: ${response.message}`;
    }
    
    return {status: response.status, message: message};
  }

  // Check if "code" is unique
  async isCodeDuplicated(newProduct){
    let products = await this.getProducts();
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
  isRequiredFieldEmpty(newProduct){
    let status = false;
    let message = '';
    let emptyProduct = new Product();
    for (const field in emptyProduct) {
      if (!newProduct[field] && field !== 'thumbnails') {
        status = true;
        message = `Erro: O campo "${field}" é obrigatório.`;
        break;
      }
    }
    return {status: status, message: message};
  }

  createId(products){
    let maxValue = Number.MIN_SAFE_INTEGER;
    try {
      products.forEach((p) => {
        if(p.id > maxValue)
        maxValue = p.id;
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

export class Product {
  constructor(title, description, code, price, status = true, stock, category, thumbnails = []) {
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}