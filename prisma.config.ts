import { defineConfig, env } from "prisma/config";
import path from "node:path";
import "dotenv/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: `ts-node --transpile-only ${path.join("prisma", "seed.ts")}`,
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
