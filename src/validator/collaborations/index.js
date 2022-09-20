// @ts-check

const InvariantError = require('../../exceptions/InvariantError');

const { PostCollaborationPayloadScheme } = require('./scheme');

const CollaborationsValidator = {
  validatePostCollaboration: (payload) => {
    const validationResult = PostCollaborationPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
