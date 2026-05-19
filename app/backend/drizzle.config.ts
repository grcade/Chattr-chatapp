import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env.js';



export default defineConfig({
  out: './src/db/drizzle',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
