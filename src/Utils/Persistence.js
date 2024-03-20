import fs from 'fs'

export default class Persistence {
  #fs = '';
  #pathAndFileName = '';

  constructor(path){
    this.#fs = fs;
    this.#pathAndFileName = path;
  }

  async write(value) {
    let status = false;
    let message = '';
    try {
      let fileExists;
      const F_OK = fs.promises.constants.F_OK;
      // fileExists  = await fs.promises.access(this.#pathAndFileName, F_OK);
      // console.warn("test: "+fileExists);
      fileExists = this.#fs.existsSync(this.#pathAndFileName);

      if (!fileExists) {
        await this.#fs.promises.writeFile(this.#pathAndFileName, "[]");
      }
      await this.#fs.promises.writeFile(this.#pathAndFileName, value);
      
      status = true;
    } catch (error) {
      message = error;
    }
    return {status: status, message: message};
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