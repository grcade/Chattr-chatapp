import { env } from '../config/env.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let db: ReturnType<typeof drizzle>;

try {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  db = drizzle(pool);

  const runQuery = async () => {
    try {
      const res = await pool.query('SELECT NOW()');
      // console.log('Database Connected at:', res.rows[0].now);
    } catch (err: any) {
      console.error('Connection error', err.stack);
    } finally {
      // End the pool connection when your application stops
      // await pool.end();
    }
  };

  runQuery();
} catch (error) {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
}
export default db;
