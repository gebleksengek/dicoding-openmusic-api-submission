// @ts-check

const ClientError = require('../exceptions/ClientError');
// const NotFoundError = require('../exceptions/NotFoundError');

/**
 *
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @param {Error} error
 * @returns {import('@hapi/hapi').ResponseObject}
 */
const hapiErrorHandler = (h, error) => {
  const responseData = {
    status: 'error',
    message: 'Maaf, terjadi kegagala pada server kami.',
  };
  let code = 500;

  if (error instanceof ClientError) {
    responseData.status = 'fail';
    responseData.message = error.message;
    code = error.statusCode;
  } else {
    console.log(error.message);
  }

  const response = h.response(responseData);
  response.code(code);

  return response;
};

module.exports = { hapiErrorHandler };
