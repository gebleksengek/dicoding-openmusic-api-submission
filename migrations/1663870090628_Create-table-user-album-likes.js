/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

const table_name = 'user_album_likes';

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(20)',
      primaryKey: true,
    },
    user_id: {
      type: 'varchar(21)',
      notNull: true,
      references: 'users(id)',
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    album_id: {
      type: 'varchar(22)',
      notNull: true,
      references: 'albums(id)',
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(
    table_name,
    `unique_${table_name}_album_id_and_user_id`,
    `UNIQUE(album_id, user_id)`
  );
};

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
