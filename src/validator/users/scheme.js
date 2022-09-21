// @ts-check

const Joi = require('joi');

const UserPayloadScheme = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = { UserPayloadScheme };
