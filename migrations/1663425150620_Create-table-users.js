/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

const table_name = 'users';

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(21)',
      primaryKey: true,
    },
    username: {
      type: 'varchar(50)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    fullname: {
      type: 'text',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
    },
  });
};

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
