import fs from 'fs'

export class ProductManager {
  #path;
  #db;

  constructor(path)
  {
    path = 'C:/Backend/ProductManager_Backend/src/produtos.json';
    this.#path = path;
    this.#db = new Persistence(this.#path);
  }

  async addProduct(newProduct) {
    // Validate that all fields are filled in
    if(this.isRequiredFieldEmpty(newProduct)) 
      return;

    // Check if "code" is unique
    if(await this.isCodeDuplicated(newProduct))
      return;

    // Add the new product
    let productsArray = await this.getProducts();
    const newId = this.createId(productsArray);
    newProduct.id = newId;

    productsArray.push(newProduct);
    productsArray = JSON.stringify(productsArray);

    await this.#db.write(productsArray);
    console.log(`Produto "${newProduct.title}" adicionado com sucesso!`);
  }

  async getProducts(){
    let productsArray = await this.#db.read();
    if(productsArray.length === 0) 
      return [];
    return JSON.parse(productsArray);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const result = products.find((product) => product.id === id);
    if(result) 
      return result;
    return `Produto com Id "${id}" não encontrado.`;
  }

  async deleteProduct(id){
    let productsArray = await this.getProducts();
    let product = await this.getProductById(id);

    if(product){
      let remainingProducts = productsArray.filter((p) => p.id !== id);
      remainingProducts = JSON.stringify(remainingProducts);
      await this.#db.write(remainingProducts);

      console.log(`Produto "${product.title}" removido com sucesso!`);
    }
  }

  async updateProduct(id, updatedProduct){
    let productsArray = await this.getProducts();
    const indexToUpdate = productsArray.findIndex((p) => p.id === id);
    if(indexToUpdate === -1){
      console.log(`Produto com Id "${id}" não encontrado.`);
      return;
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
    await this.#db.write(productsArray);

    console.log(`Produto "${updatedProduct.title}" atualizado com sucesso!`);
  }

  // Check if "code" is unique
  async isCodeDuplicated(newProduct){
    let products = await this.getProducts();
    let codeIsDuplicated = false;

    if(products){
      codeIsDuplicated = products.find(
        (existingProduct) => existingProduct.code === newProduct.code
      );

      if (codeIsDuplicated) {
        console.error(`Erro: O código "${newProduct.code}" já foi cadastrado.`);
      }
    }

    return codeIsDuplicated;
  }

  // Validate that all fields are filled in
  isRequiredFieldEmpty(newProduct){
    for (const field in newProduct) {
      if (!newProduct[field] && field !== 'thumbnails' ) {
        console.error(`Erro: O campo "${field}" obrigatório.`);
        return true;
      }
    }

    return false;
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
  constructor(title, description,  code, price, status = true, stock, category, thumbnails) {
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

class Persistence {
  #fs = '';
  #pathAndFileName = '';

  constructor(path){
    this.#fs = fs;
    this.#pathAndFileName = path;
  }

  async write(value) {
    try {
      // const F_OK = this.#fs.promises.constants.F_OK;
      // const fileExists = await this.#fs.promises.access(this.#pathAndFileName, F_OK);
      // console.warn("test: "+fileExists);
      const fileExists = this.#fs.existsSync(this.#pathAndFileName);

      if (!fileExists) {
        await this.#fs.promises.writeFile(this.#pathAndFileName, "[]");
      }
      await this.#fs.promises.writeFile(this.#pathAndFileName, value);
    } catch (error) {
      console.error(`Erro ao escrever no arquivo: ${error}`);
    }
  }

  async read(){
    let productsArray = await this.#fs.promises.readFile(this.#pathAndFileName, 'utf-8');
    if(productsArray){
      if(!Array.isArray(productsArray)){
        productsArray = Array.of(productsArray);
      }
      return productsArray;
    }
    return [];
  }
}