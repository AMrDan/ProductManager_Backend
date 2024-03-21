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
      await this.createFileIfNeeded();
      
      if(!Array.isArray(value)){
        value = [value];
      }
      await this.#fs.promises.writeFile(this.#pathAndFileName, value);
      status = true;
    } catch (error) {
      message = error;
    }
    return {status: status, message: message};
  }

  async read() {
    await this.createFileIfNeeded();
    let contentArray = await this.#fs.promises.readFile(this.#pathAndFileName, 'utf-8');
    if(contentArray) {
      if(!Array.isArray(contentArray)){
        contentArray = Array.of(contentArray);
      }
      return contentArray;
    }
    return [];
  }

  async createFileIfNeeded() {
    let fileExists;
    // const F_OK = fs.promises.constants.F_OK;
    // fileExists  = await fs.promises.access(this.#pathAndFileName, F_OK);
    // console.warn("test: "+fileExists);
    fileExists = this.#fs.existsSync(this.#pathAndFileName);

    if (!fileExists) {
      await this.#fs.promises.writeFile(this.#pathAndFileName, "[]");
    }
  }
}