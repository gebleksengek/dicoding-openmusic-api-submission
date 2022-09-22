// @ts-check

/**
 * Album entity interface
 *
 * @typedef {object} IAlbumEntity
 * @property {string} name
 * @property {number} year
 */

/**
 * Albums Service interface
 *
 * @typedef {object} IAlbumsService
 * @property {function(IAlbumEntity): Promise<string> | string} addAlbum
 * @property {function(): Promise<Array> | Array} getAlbums
 * @property {function(string): Promise<any> | any} getAlbumById
 * @property {function(string, IAlbumEntity): Promise<void> | void} editAlbumById
 * @property {function(string, string): Promise<void> | void} editAlbumCoverById
 * @property {function(string): Promise<void> | void} deleteAlbumById
 */

module.exports = {};
