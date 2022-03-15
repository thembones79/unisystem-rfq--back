/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE distributors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(200) UNIQUE NOT NULL
  );

  CREATE UNIQUE INDEX ON distributors (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE distributors;
  `);
};
