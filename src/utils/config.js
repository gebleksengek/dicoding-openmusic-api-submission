const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwtToken: {
    access_token_key: process.env.ACCESS_TOKEN_KEY
      ? process.env.ACCESS_TOKEN_KEY
      : '1fd3b1cf932a77dc',
    refresh_token_key: process.env.REFRESH_TOKEN_KEY
      ? process.env.REFRESH_TOKEN_KEY
      : 'ddebe603fe57b33b',
    access_token_age: process.env.ACCESS_TOKEN_AGE,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER
      ? process.env.RABBITMQ_SERVER
      : 'amqp://localhost',
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
