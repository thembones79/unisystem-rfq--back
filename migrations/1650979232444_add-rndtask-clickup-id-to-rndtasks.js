/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE rndtasks
    ADD COLUMN rndtask_clickup_id VARCHAR(18);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE rndtasks
    DROP COLUMN rndtask_clickup_id;
  `);
};
