// @ts-check

/**
 * @param {import('./handler')} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongs,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongById,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongById,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteAlbumById,
  },
];

module.exports = routes;
