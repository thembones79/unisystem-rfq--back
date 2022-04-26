import { BadRequestError } from "../errors";
import { pool } from "../pool";

class RndTaskRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
      p.id,
      pn,
      projects.department AS department,
      projects.project_code AS project,
      project_clients.name AS client,
      industries.name AS industry,
      pm.shortname AS pm,
      kam.shortname AS kam,
      to_char(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as created
      FROM partnumbers AS p
      JOIN projects ON projects.id = p.project_id
      JOIN project_clients ON project_clients.id = projects.project_client_id
      JOIN industries ON industries.id = projects.industry_id
      JOIN users AS pm ON pm.id = projects.pm_id
      JOIN users AS kam ON kam.id = project_clients.kam_id
      ORDER BY created;
      `);
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findById(id: string) {
    try {
      const result = await pool.query(
        `
        SELECT
        p.id,
        pn,
        p.project_id AS project_id,
        projects.department AS department,
        projects.project_code AS project,
        project_clients.name AS client,
        industries.name AS industry,
        pm.username AS pm_fullname,
        kam.username AS kam_fullname,
        pm.shortname AS pm,
        kam.shortname AS kam,
        p.version AS version,
        p.revision AS revision,
        p.note AS note,
        to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM partnumbers AS p
        JOIN projects ON projects.id = p.project_id
        JOIN project_clients ON project_clients.id = projects.project_client_id
        JOIN industries ON industries.id = projects.industry_id
        JOIN users AS pm ON pm.id = projects.pm_id
        JOIN users AS kam ON kam.id = project_clients.kam_id
        WHERE p.id = $1
        `,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByPartnumber(pn: string) {
    try {
      const result = await pool.query(
        `SELECT id, pn FROM partnumbers WHERE pn = $1;`,
        [pn]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByProjectId(project_id: string) {
    try {
      const result = await pool.query(
        `SELECT id, pn, version, revision, note FROM partnumbers WHERE project_id = $1;`,
        [project_id]
      );
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    pn,
    project_id,
    version,
    revision,
    note,
  }: {
    pn: string;
    project_id: string;
    version: string;
    revision: string;
    note: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO partnumbers (
          pn,
          project_id,
          version,
          revision,
          note)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, pn;`,
        [pn, project_id, version, revision, note]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    version,
    revision,
    note,
  }: {
    id: string;
    version: string;
    revision: string;
    note: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE partnumbers SET
          version = $2,
          revision = $3,
          note = $4,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, pn;`,
        [id, version, revision, note]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM partnumbers WHERE id = $1 RETURNING id, pn;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM partnumbers;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { RndTaskRepo };
