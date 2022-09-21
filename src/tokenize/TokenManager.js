// @ts-check

const Jwt = require('@hapi/jwt');

const config = require('../utils/config');

const InvariantError = require('../exceptions/InvariantError');

/**
 * @typedef {{userId: string}} JwtPayload
 */

const TokenManager = {
  generateAccessToken: (/** @type {JwtPayload} */ payload) => {
    return Jwt.token.generate(payload, config.jwtToken.access_token_key);
  },
  generateRefreshToken: (/** @type {JwtPayload} */ payload) => {
    return Jwt.token.generate(payload, config.jwtToken.refresh_token_key);
  },
  verifyRefreshToken: (/** @type {string} */ refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.jwtToken.refresh_token_key);

      const { payload } = artifacts.decoded;

      return /** @type {JwtPayload} */ (payload);
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
