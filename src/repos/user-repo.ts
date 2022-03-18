import { BadRequestError } from "../errors";
import { pool } from "../pool";

class UserRepo {
  static async find() {
    try {
      const result = await pool.query(
        `
        SELECT id, username, username AS name, email, shortname, role_id, shortname_alt
        FROM users
        WHERE role_id <> 1 AND deleted = false
        ORDER BY username;
        `
      );
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findWithAdmins() {
    try {
      const result = await pool.query(
        `
        SELECT users.id AS id, username, username AS name, email, shortname, shortname_alt, role_id, role
        FROM users
        JOIN roles ON roles.id = users.role_id
        WHERE deleted = false
        ORDER BY username;
        `
      );
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findById(id: string) {
    try {
      const result = await pool.query(
        `SELECT id, username, email, shortname, shortname_alt, role_id FROM users WHERE id = $1;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByEmail(email: string) {
    try {
      const result = await pool.query(
        `SELECT id, username, email, password, shortname, shortname_alt, role_id, deleted FROM users WHERE email = $1;`,
        [email]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    username,
    password,
    email,
    shortname,
    shortname_alt,
    role_id,
  }: {
    username: string;
    password: string;
    email: string;
    shortname: string;
    shortname_alt: string;
    role_id: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO users (username, password, email, shortname, shortname_alt, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, shortname, shortname_alt, role_id;`,
        [username, password, email, shortname, shortname_alt, role_id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    username,
    email,
    shortname,
    shortname_alt,
    role_id,
  }: {
    id: string;
    username: string;
    email: string;
    shortname: string;
    shortname_alt: string;
    role_id: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE users SET username = $2, email = $3, shortname = $4, shortname_alt = $5, role_id = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, email, shortname, shortname_alt, role_id;`,
        [id, username, email, shortname, shortname_alt, role_id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updatePassword({
    id,
    password,
  }: {
    id: string;
    password: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role_id, shortname, shortname_alt;`,
        [password, id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING id, username, email, role_id, shortname, shortname_alt;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async markDeleted(id: string) {
    try {
      const result = await pool.query(
        `UPDATE users SET deleted = TRUE WHERE id = $1 RETURNING id, username, email, role_id, shortname, shortname_alt;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async markUndeleted(id: string) {
    try {
      const result = await pool.query(
        `UPDATE users SET deleted = FALSE WHERE id = $1 RETURNING id, username, email, role_id, shortname, shortname_alt;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM users;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { UserRepo };
