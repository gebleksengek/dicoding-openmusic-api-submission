/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

const table_name = 'playlists';

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(25)',
      primaryKey: true,
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
    },
    owner: {
      type: 'varchar(21)',
      notNull: true,
      references: 'users(id)',
      onUpdate: 'cascade',
      onDelete: 'cascade',
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
