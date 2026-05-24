import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.route.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  })
);

app.use('/health', healthRoutes);

export default app;
