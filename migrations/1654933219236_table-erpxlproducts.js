/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE erpxl_products (
    id INTEGER PRIMARY KEY UNIQUE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    partnumber VARCHAR(380) UNIQUE NOT NULL,
    description TEXT
  );

  CREATE UNIQUE INDEX ON erpxl_products (id);
  CREATE UNIQUE INDEX ON erpxl_products (partnumber);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE erpxl_products;
  `);
};
