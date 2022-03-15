import { randomBytes } from "crypto";
import migrate from "node-pg-migrate";
import format from "pg-format";
import { pool } from "../pool";

const DEFAULT_OPTS = {
  host: "localhost",
  port: 5432,
  database: "riverdirfq-test",
  user: "michal",
  password: "",
};

export class Context {
  static async build() {
    // Randomly generate a role name to connect to PG as
    const roleName = "b" + randomBytes(4).toString("hex");

    // Connect to PG as usual
    await pool.connect(DEFAULT_OPTS);

    // Create a new role
    await pool.query(
      format("CREATE ROLE %I WITH LOGIN PASSWORD %L;", roleName, roleName)
    );

    // Create a schema wuth the same name
    await pool.query(
      format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName)
    );

    // Disconnect entirely from PG
    await pool.close();

    const ROLE_OPTS = {
      ...DEFAULT_OPTS,
      user: roleName,
      password: roleName,
    };

    // Run our migrations in the new schema
    // @ts-ignore

    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: ROLE_OPTS,
    });

    // Connect to PG as the newly created role
    await pool.connect(ROLE_OPTS);

    // insert necessary initial data
    await pool.query(
      `INSERT INTO roles(role) VALUES ('admin'),('pm'),('kam');`
    );
    await pool.query(`INSERT INTO customers(id, name) VALUES (1, 'ABCD');`);
    await pool.query(`INSERT INTO distributors(name) VALUES ('EFGH');`);

    jest.setTimeout(30000);

    return new Context(roleName);
  }

  constructor(public roleName: string) {
    this.roleName = roleName;
  }

  async reset() {
    await pool.query(`DELETE FROM rfqs;`);
    await pool.query(`DELETE FROM users;`);
  }

  async close() {
    // Delete initial data
    await pool.query(`DELETE FROM rfqs;`);
    await pool.query(`DELETE FROM users;`);
    await pool.query(`DELETE FROM roles;`);
    await pool.query(`DELETE FROM customers;`);
    await pool.query(`DELETE FROM distributors;`);

    // Disconnect from PG
    await pool.close();

    // Reconnect as out root user
    await pool.connect(DEFAULT_OPTS);

    // Delete role and schema we created
    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
    await pool.query(format("DROP ROLE %I;", this.roleName));

    // Disconnect

    await pool.close();
  }
}
