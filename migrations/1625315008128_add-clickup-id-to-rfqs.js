/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    ADD COLUMN clickup_id VARCHAR(18);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    DROP COLUMN clickup_id;
  `);
};
