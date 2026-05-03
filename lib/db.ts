import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __aiContactFormPool__: Pool | undefined;
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for PostgreSQL access.`);
  }
  return value;
}

export function getDb() {
  if (!global.__aiContactFormPool__) {
    global.__aiContactFormPool__ = new Pool({
      connectionString: requiredEnv("DATABASE_URL"),
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false }
    });
  }

  return global.__aiContactFormPool__;
}
