// @ts-check

const Joi = require('joi');

const PostCollaborationPayloadScheme = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  PostCollaborationPayloadScheme,
};
