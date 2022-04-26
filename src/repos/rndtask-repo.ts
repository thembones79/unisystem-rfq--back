import { BadRequestError } from "../errors";
import { pool } from "../pool";

class RndTaskRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
      project_id,
      rndtask_clickup_id,
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

  // static async findById(id: string) {
  //   try {
  //     const result = await pool.query(
  //       `
  //       SELECT
  //       p.id,
  //       pn,
  //       p.project_id AS project_id,
  //       projects.department AS department,
  //       projects.project_code AS project,
  //       project_clients.name AS client,
  //       industries.name AS industry,
  //       pm.username AS pm_fullname,
  //       kam.username AS kam_fullname,
  //       pm.shortname AS pm,
  //       kam.shortname AS kam,
  //       p.version AS version,
  //       p.revision AS revision,
  //       p.note AS note,
  //       to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
  //       FROM partnumbers AS p
  //       JOIN projects ON projects.id = p.project_id
  //       JOIN project_clients ON project_clients.id = projects.project_client_id
  //       JOIN industries ON industries.id = projects.industry_id
  //       JOIN users AS pm ON pm.id = projects.pm_id
  //       JOIN users AS kam ON kam.id = project_clients.kam_id
  //       WHERE p.id = $1
  //       `,
  //       [id]
  //     );
  //     return result?.rows[0];
  //   } catch (error: any) {
  //     throw new BadRequestError(error.message);
  //   }
  // }

  // static async findByPartnumber(pn: string) {
  //   try {
  //     const result = await pool.query(
  //       `SELECT id, pn FROM partnumbers WHERE pn = $1;`,
  //       [pn]
  //     );
  //     return result?.rows[0];
  //   } catch (error: any) {
  //     throw new BadRequestError(error.message);
  //   }
  // }

  static async findByProjectId(project_id: string) {
    try {
      const result = await pool.query(
        `SELECT project_id, serial, rndtask_clickup_id FROM rndtasks WHERE project_id = $1;`,
        [project_id]
      );
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findMaxSerialForGivenProjectId(project_id: string) {
    try {
      const result = await pool.query(
        `SELECT MAX(serial) FROM rndtasks WHERE project_id LIKE $1;`,
        [`${project_id}%`]
      );

      console.log({ max_count: result?.rows[0] });
      const max = result?.rows[0].max;
      return max ? max : 0;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    project_id,
    serial,
    rndtask_clickup_id,
  }: {
    project_id: string;
    serial: string;
    rndtask_clickup_id: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO rndtasks (
          project_id,
          serial,
          rndtask_clickup_id)
          VALUES ($1, $2, $3)
          RETURNING project_id, serial, rndtask_clickup_id;`,
        [project_id, serial, rndtask_clickup_id]
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
