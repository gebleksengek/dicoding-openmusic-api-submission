// @ts-check

/**
 * @typedef {object} IUserAlbumLikes
 * @property {function({albumId: string, userId: string}): Promise<string> | string} likeOrUnlikeAlbum
 * @property {function(string): Promise<{cached: boolean, count: number}> | {cached: boolean, count: number}} getAlbumTotalLikes
 */

module.exports = {};
