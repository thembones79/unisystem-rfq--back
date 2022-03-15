/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    ADD COLUMN extra_note VARCHAR(240);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    DROP COLUMN extra_note;
  `);
};
