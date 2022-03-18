/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE users
    ADD COLUMN shortname VARCHAR(8) UNIQUE NOT NULL,
    ADD COLUMN shortname_alt VARCHAR(8) UNIQUE,
    ADD COLUMN deleted BOOLEAN DEFAULT FALSE,
    ADD COLUMN role_id INTEGER NOT NULL REFERENCES roles(id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE users
    DROP COLUMN shortname,
    DROP COLUMN shortname_alt,
    DROP COLUMN deleted,
    DROP COLUMN role_id;
  `);
};
