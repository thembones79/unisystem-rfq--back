/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    ADD COLUMN final_solutions TEXT,
    ADD COLUMN conclusions TEXT,
    ADD COLUMN samples_expected VARCHAR(180),
    ADD COLUMN mp_expected VARCHAR(180),
    ADD COLUMN eau_max INTEGER;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    DROP COLUMN final_solutions,
    DROP COLUMN conclusions,
    DROP COLUMN samples_expected,
    DROP COLUMN mp_expected,
    DROP COLUMN eau_max;
  `);
};
