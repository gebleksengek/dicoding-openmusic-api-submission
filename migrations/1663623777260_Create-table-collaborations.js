/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

const table_name = 'collaborations';

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(23)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(25)',
      notNull: true,
      references: 'playlists(id)',
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    user_id: {
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

  pgm.addConstraint(
    table_name,
    `unique_${table_name}_playlist_id_and_user_id`,
    'UNIQUE(playlist_id, user_id)'
  );
};

/**
 *
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
