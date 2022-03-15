import pg, { QueryConfig, PoolConfig } from "pg";

class Pool {
  _pool: pg.Pool | null = null;
  connect(options: PoolConfig | undefined) {
    this._pool = new pg.Pool(options);
    return this._pool.query(`SELECT 1 + 1;`);
  }

  close() {
    return this._pool?.end();
  }

  query(sql: string | QueryConfig<string[]>, params?: string[] | undefined) {
    return this._pool?.query(sql, params);
  }
}

export const pool = new Pool();
