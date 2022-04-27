import { BadRequestError } from "../errors";
import { pool } from "../pool";

class RndTaskRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
      project_id,
      rndtask_clickup_id,
      sp,
      serial,
      to_char(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as created
      FROM rndtasks
      ORDER BY created;
      `);
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByProjectId(project_id: string) {
    try {
      const result = await pool.query(
        `SELECT project_id, serial, sp, rndtask_clickup_id FROM rndtasks WHERE project_id = $1;`,
        [project_id]
      );
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByProjectIdAndSerial({
    serial,
    project_id,
  }: {
    serial: string;
    project_id: string;
  }) {
    try {
      const result = await pool.query(
        `SELECT project_id, serial FROM rndtasks WHERE project_id = $1 AND serial = $2;`,
        [project_id, serial]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findMaxSerialForGivenProjectId(project_id: string) {
    try {
      const result = await pool.query(
        `SELECT MAX(serial) FROM rndtasks WHERE project_id = $1;`,
        [project_id]
      );

      console.log({ max_count: result?.rows[0] });
      const max = result?.rows[0].max;
      return max ? parseInt(max) : 0;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    project_id,
    sp,
    serial,
    rndtask_clickup_id,
  }: {
    project_id: string;
    sp: string;
    serial: string;
    rndtask_clickup_id: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO rndtasks (
          project_id,
          sp,
          serial,
          rndtask_clickup_id)
          VALUES ($1, $2, $3, $4)
          RETURNING project_id, serial, rndtask_clickup_id;`,
        [project_id, sp, serial, rndtask_clickup_id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete({
    serial,
    project_id,
  }: {
    serial: string;
    project_id: string;
  }) {
    try {
      const result = await pool.query(
        `DELETE FROM rndtasks WHERE project_id = $1 AND serial = $2 RETURNING project_id, serial;`,
        [project_id, serial]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM rndtasks;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { RndTaskRepo };
