// @ts-check
/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder}  MigrationBuilder
 */

const table_name = 'authentications';

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    token: {
      type: 'text',
      notNull: true,
    },
  });
};

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
