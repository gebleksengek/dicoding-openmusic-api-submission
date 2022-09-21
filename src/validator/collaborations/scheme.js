// @ts-check

const Joi = require('joi');

const PostCollaborationPayloadScheme = Joi.object({
  playlistId: Joi.string().max(25).required(),
  userId: Joi.string().max(21).required(),
});

module.exports = {
  PostCollaborationPayloadScheme,
};
