/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`

  ALTER TABLE rfqs
    ALTER COLUMN req_disp_spec TYPE TEXT,
    ALTER COLUMN req_tp_spec TYPE TEXT;

  `);
};

exports.down = (pgm) => {
  pgm.sql(`

  ALTER TABLE rfqs
    ALTER COLUMN req_disp_spec TYPE VARCHAR(80),
    ALTER COLUMN req_tp_spec TYPE VARCHAR(80);

  `);
};
