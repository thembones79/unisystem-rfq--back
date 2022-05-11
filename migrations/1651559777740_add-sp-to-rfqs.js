/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    ADD COLUMN sp VARCHAR(400);

  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    DROP COLUMN sp;
  `);
};
