import { BadRequestError } from "../errors";
import { pool } from "../pool";

class ProjectRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
        p.id,
        project_code,
        department,
        project_clients.name AS client,
        industries.name AS industry,
        pm.shortname AS pm,
        kam.shortname AS kam,
        to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM projects AS p
        JOIN project_clients ON project_clients.id = p.project_client_id
        JOIN industries ON industries.id = p.industry_id
        JOIN users AS pm ON pm.id = p.pm_id
        JOIN users AS kam ON kam.id = project_clients.kam_id
        ORDER BY updated DESC;
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
          project_code,
          department,
          project_clients.name AS client,
          industries.name AS industry,
          pm.shortname AS pm,
          kam.shortname AS kam,
          rfq_id,
          rfqs.name AS rfq,
          clickup_id,
          version,
          revision,
          note,
          to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
          FROM projects AS p
          JOIN project_clients ON project_clients.id = p.project_client_id
          JOIN industries ON industries.id = p.industry_id
          JOIN rfqs ON rfqs.id = p.rfq_id
          JOIN users AS pm ON pm.id = p.pm_id
          JOIN users AS kam ON kam.id = project_clients.kam_id
        WHERE r.id = $1
        `,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByProjectCode(project_code: string) {
    try {
      const result = await pool.query(
        `SELECT id, project_code FROM projects WHERE project_code = $1;`,
        [project_code]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByClientId(project_client_id: string) {
    try {
      const result = await pool.query(
        `SELECT id, project_code FROM projects WHERE project_client_id = $1;`,
        [project_client_id]
      );
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByIndustryId(industry_id: string) {
    try {
      const result = await pool.query(
        `SELECT id, project_code FROM projects WHERE industry_id = $1;`,
        [industry_id]
      );
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findMaxNumberForGivenCode(clientCode: string) {
    try {
      const result = await pool.query(
        `SELECT MAX(code) FROM project_clients WHERE code LIKE $1;`,
        [`${clientCode}%`]
      );

      console.log({ count: parseInt(result?.rows[0]) });
      const max = result?.rows[0].max;
      return max ? parseInt(max.substring(max.length - 3)) : 0;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    project_code,
    project_client_id,
    industry_id,
    rfq_id,
    department,
    pm_id,
    clickup_id,
    version,
    revision,
    note,
  }: {
    project_code: string;
    project_client_id: string;
    industry_id: string;
    rfq_id: string;
    department: string;
    pm_id: string;
    clickup_id: string;
    version: string;
    revision: string;
    note: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO projects (
          project_code,
          project_client_id,
          industry_id,
          rfq_id,
          department,
          pm_id,
          clickup_id,
          version,
          revision,
          note)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id, project_code;`,
        [
          project_code,
          project_client_id,
          industry_id,
          rfq_id,
          department,
          pm_id,
          clickup_id,
          version,
          revision,
          note,
        ]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    pm_id,
    version,
    revision,
    note,
  }: {
    id: string;
    pm_id: string;
    version: string;
    revision: string;
    note: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE projects SET
          pm_id = $2,
          version = $3,
          revision = $4,
          note = $5,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, project_code;`,
        [id, pm_id, version, revision, note]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM projects WHERE id = $1 RETURNING id, project_code;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM projects;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { ProjectRepo };
