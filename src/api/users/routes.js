// @ts-check

/**
 * @param {import('./handler')} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
];

module.exports = routes;
