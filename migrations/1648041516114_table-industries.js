/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(80) UNIQUE NOT NULL
  );

  CREATE UNIQUE INDEX ON industries (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE industries;
  `);
};
