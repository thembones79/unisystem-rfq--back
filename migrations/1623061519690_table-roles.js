/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(80) UNIQUE NOT NULL
  );

  CREATE UNIQUE INDEX ON roles (role);

  CREATE UNIQUE INDEX ON roles (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE roles;
  `);
};
