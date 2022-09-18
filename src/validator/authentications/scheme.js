// @ts-check

const Joi = require('joi');

const PostAuthenticationPayloadScheme = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadScheme = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadScheme = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPayloadScheme,
  PutAuthenticationPayloadScheme,
  DeleteAuthenticationPayloadScheme,
};
