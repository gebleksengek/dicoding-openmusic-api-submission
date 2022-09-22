// @ts-check

const fs = require('fs');

class StorageService {
  /**
   * @readonly
   * @private
   */
  _folder;

  /**
   * @param {string} folder
   */
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(this._folder)) {
      fs.mkdirSync(this._folder, { recursive: true });
    }
  }

  /**
   * @param {any} file
   * @param {any} meta
   * @returns {Promise<string>}
   */
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
