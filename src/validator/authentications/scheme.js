// @ts-check

const Joi = require('joi');

const PostAuthenticationPayloadScheme = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadScheme = Joi.object({
  refreshToken: Joi.string().token().required(),
});

const DeleteAuthenticationPayloadScheme = Joi.object({
  refreshToken: Joi.string().token().required(),
});

module.exports = {
  PostAuthenticationPayloadScheme,
  PutAuthenticationPayloadScheme,
  DeleteAuthenticationPayloadScheme,
};
