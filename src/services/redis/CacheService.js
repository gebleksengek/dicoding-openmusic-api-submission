// @ts-check

const redis = require('redis');

const config = require('../../utils/config');

/**
 * @typedef {import('@redis/client/dist/lib/commands').RedisCommandArgument} RedisCommandArgument
 */

class CacheService {
  /**
   * @readonly
   * @private
   */
  _client;

  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.log(error);
    });

    this._client.connect();
  }

  /**
   * @param {RedisCommandArgument} key
   * @param {RedisCommandArgument} value
   * @param {number} exp
   */
  async set(key, value, exp = 1800) {
    await this._client.set(key, value, {
      EX: exp,
    });
  }

  /**
   * @param {RedisCommandArgument} key
   * @returns {Promise<any>}
   */
  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  /**
   * @param {RedisCommandArgument} key
   * @returns {Promise<any>}
   */
  async delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
