import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const configDir = dirname(fileURLToPath(import.meta.url));
const repoRootEnvPath = join(configDir, '..', '..', '.env');

if (existsSync(repoRootEnvPath)) {
  dotenv.config({ path: repoRootEnvPath });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is missing. Make sure the repo-root .env file is loaded before running drizzle-kit studio.'
  );
}

export default defineConfig({
  out: './src/db/drizzle',
  schema: './src/db/schema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
