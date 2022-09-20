// @ts-check

const {
  DeleteAuthenticationPayloadScheme,
  PostAuthenticationPayloadScheme,
  PutAuthenticationPayloadScheme,
} = require('./scheme');

const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthentication: (payload) => {
    const validationResult = PostAuthenticationPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthencation: (payload) => {
    const validationResult = PutAuthenticationPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthentication: (payload) => {
    const validationResult =
      DeleteAuthenticationPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
