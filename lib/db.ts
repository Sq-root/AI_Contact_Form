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

function parseNumberEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function resolveSsl(connectionString: string) {
  const pgSslMode = process.env.PGSSLMODE?.toLowerCase();

  if (pgSslMode === "disable") {
    return false;
  }

  if (connectionString.toLowerCase().includes("sslmode=disable")) {
    return false;
  }

  return { rejectUnauthorized: false };
}

export function getDb() {
  if (!global.__aiContactFormPool__) {
    const connectionString = requiredEnv("DATABASE_URL");

    global.__aiContactFormPool__ = new Pool({
      connectionString,
      ssl: resolveSsl(connectionString),
      max: parseNumberEnv("DATABASE_POOL_MAX", 5),
      idleTimeoutMillis: parseNumberEnv("DATABASE_IDLE_TIMEOUT_MS", 30000),
      connectionTimeoutMillis: parseNumberEnv("DATABASE_CONNECTION_TIMEOUT_MS", 10000)
    });
  }

  return global.__aiContactFormPool__;
}
