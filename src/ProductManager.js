class ProductManager {
  #path;
  #db;

  constructor(path)
  {
    this.#path = path;
    this.#db = new Persistence(this.#path);
    // ----------------  JIC you need to add products ----------------
    // const prod1 = new Product(
    //   "Prod1", // title
    //   "Descrição Prod 1", // description
    //   10.0, // price
    //   "caminho/thumb1.jpg", // thumbnail
    //   "1", // code
    //   1 // stock
    // );

    // const prod2 = new Product(
    //   "Prod2", // title
    //   "Descrição Prod 2", // description
    //   20.0, // price
    //   "caminho/thimb2.jpg", // thumbnail
    //   "2", // code
    //   2 // stock
    // );

    // const prod3 = new Product(
    //   "Prod3", // title
    //   "Descrição Prod 3", // description
    //   30.0, // price
    //   "caminho/thimb3.jpg", // thumbnail
    //   "3", // code
    //   3 // stock
    // );
    // this.addProduct(prod1);
    // this.addProduct(prod2);
    // this.addProduct(prod3);
    // ---------------- End of: JIC you need to add products ----------------
  }

  addProduct(newProduct) {
    // Validate that all fields are filled in
    if(this.isRequiredFieldEmpty(newProduct)) 
      return;

    // Check if "code" is unique
    if(this.isCodeDuplicated(newProduct)) 
      return;

    // Add the new product
    let productsArray = this.getProducts();
    const newId = this.createId(productsArray);
    newProduct.id = newId;

    productsArray.push(newProduct);
    productsArray = JSON.stringify(productsArray);

    this.#db.write(productsArray);
    console.log(`Produto "${newProduct.title}" adicionado com sucesso!`);
  }

  getProducts(){
    let productsArray = this.#db.read();
    if(productsArray.length === 0) 
      return [];
    return JSON.parse(productsArray);
  }

  getProductById(id) {
    const products = this.getProducts();
    const result = products.find((product) => product.id === id);
    if(result) 
      return result;
    console.log(`Produto com Id "${id}" não encontrado.`);
  }

  deleteProduct(id){
    let productsArray = this.getProducts();
    let product = this.getProductById(id);

    if(product){
      let remainingProducts = productsArray.filter((p) => p.id !== id);
      remainingProducts = JSON.stringify(remainingProducts);
      this.#db.write(remainingProducts);

      console.log(`Produto "${product.title}" removido com sucesso!`);
    }
  }

  updateProduct(id, updatedProduct){
    let productsArray = this.getProducts();
    const indexToUpdate = productsArray.findIndex((p) => p.id === id);
    if(indexToUpdate === -1){
      console.log(`Produto com Id "${id}" não encontrado.`);
      return;
    }
    productsArray[indexToUpdate].title = updatedProduct.title;
    productsArray[indexToUpdate].description = updatedProduct.description;
    productsArray[indexToUpdate].price = updatedProduct.price;
    productsArray[indexToUpdate].thumbnail = updatedProduct.thumbnail;
    productsArray[indexToUpdate].code = updatedProduct.code;
    productsArray[indexToUpdate].stock = updatedProduct.stock;

    productsArray = JSON.stringify(productsArray);
    this.#db.write(productsArray);

    console.log(`Produto "${updatedProduct.title}" atualizado com sucesso!`);
  }

  // Check if "code" is unique
  isCodeDuplicated(newProduct){
    let products = this.getProducts();
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
      if (!newProduct[field]) {
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

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    // this.id = products.length + 1;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class Persistence {
  #fs = '';
  #pathAndFileName = '';

  constructor(path){
    this.#fs = require('fs');

    this.#pathAndFileName = path;

    if (!this.#fs.existsSync(this.#pathAndFileName)) {
      this.#fs.writeFileSync(this.#pathAndFileName, "[]");
    }
  }

  write(value) {
    try {
      this.#fs.writeFileSync(this.#pathAndFileName, value);
      // console.log("Dados salvos com sucesso!");
    } catch (error) {
      console.error(`Erro ao escrever no arquivo: ${error}`);
    }
  }

  read(){
    let productsArray = this.#fs.readFileSync(this.#pathAndFileName, 'utf-8');
    if(productsArray){
      if(!Array.isArray(productsArray)){
        productsArray = Array.of(productsArray);
      }
      return productsArray;
    }
    return [];
  }
}

module.exports = { ProductManager, Product };