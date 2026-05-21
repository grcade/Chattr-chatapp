import { Router } from 'express';
import { sql } from 'drizzle-orm';

import db from '../db/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);

    return res.json({
      status: 'healthy',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'unhealthy',
      error,
    });
  }
});

export default router;
