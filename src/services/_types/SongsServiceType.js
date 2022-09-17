// @ts-check

/**
 * Songs entity interface
 *
 * @typedef {object} ISongEntity
 * @property {string} title
 * @property {number} year
 * @property {string} performer
 * @property {string} genre
 * @property {number|null} duration
 * @property {string|null} albumId
 */

/**
 * Songs Service interface
 *
 * @typedef {object} ISongsService
 * @property {function(ISongEntity): Promise<string> | string} addSong
 * @property {function(ISongsGetQuery): Promise<Array<any>> | Array<any>} getSongs
 * @property {function(string): Promise<any> | any} getSongById
 * @property {function(string, ISongEntity): Promise<void> | void} editSongById
 * @property {function(string): Promise<void> | void} deleteSongById
 */

/**
 * Songs Get Filter Query
 *
 * @typedef {object} ISongsGetQuery
 * @property {string} title
 * @property {string} performer
 */

module.exports = {};
