/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL
  );

  CREATE UNIQUE INDEX ON users (email);

  CREATE UNIQUE INDEX ON users (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE users;
  `);
};
