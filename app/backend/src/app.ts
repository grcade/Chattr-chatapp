import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  })
);

app.use('/health', healthRoutes);

export default app;
