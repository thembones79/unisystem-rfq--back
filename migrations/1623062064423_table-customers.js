/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE customers (
    id INTEGER PRIMARY KEY UNIQUE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(80) UNIQUE NOT NULL
  );

  CREATE UNIQUE INDEX ON customers (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE customers;
  `);
};
