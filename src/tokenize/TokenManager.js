// @ts-check

const Jwt = require('@hapi/jwt');

const InvariantError = require('../exceptions/InvariantError');

/**
 * @typedef {{userId: string}} JwtPayload
 */

const accessTokenKey = process.env.ACCESS_TOKEN_KEY
  ? process.env.ACCESS_TOKEN_KEY
  : '1fd3b1cf932a77dc';
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY
  ? process.env.REFRESH_TOKEN_KEY
  : 'ddebe603fe57b33b';

const TokenManager = {
  generateAccessToken: (/** @type {JwtPayload} */ payload) => {
    return Jwt.token.generate(payload, accessTokenKey);
  },
  generateRefreshToken: (/** @type {JwtPayload} */ payload) => {
    return Jwt.token.generate(payload, refreshTokenKey);
  },
  verifyRefreshToken: (/** @type {string} */ refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, refreshTokenKey);

      const { payload } = artifacts.decoded;

      return /** @type {JwtPayload} */ (payload);
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
