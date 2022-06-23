import { BadRequestError } from "../errors";
import { pool } from "../pool";

class ConfigRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
        configs.id AS id,
        name,
        user_id,
        category,
        template,
        users.shortname AS kam,
        to_char(configs.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM configs
        JOIN users ON users.id = configs.user_id
        ORDER BY name;
      `);
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByKamId(kamId: string) {
    try {
      const result = await pool.query(
        `
      SELECT
        configs.id AS id,
        name,
        user_id,
        category,
        template,
        users.shortname AS kam,
        to_char(configs.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM configs
        JOIN users ON users.id = configs.user_id
        WHERE user_id = $1
        ORDER BY name;
      `,
        [kamId]
      );
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
        configs.id AS id,
        name,
        user_id,
        category,
        template,
        users.shortname AS kam,
        to_char(configs.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM configs
        JOIN users ON users.id = configs.user_id
        WHERE configs.id = $1
        `,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    name,
    user_id,
    category,
    template,
  }: {
    name: string;
    user_id: string;
    category: string;
    template: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO configs (
            name,
            user_id,
            category,
            template)
          VALUES ($1, $2, $3, $4)
          RETURNING id, name;`,
        [name, user_id, category, template]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    name,
    template,
  }: {
    id: string;
    name: string;
    template: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE configs SET
          name = $2,
          template = $3,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, name;`,
        [id, name, template]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM configs WHERE id = $1 RETURNING id, name;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM configs;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { ConfigRepo };
