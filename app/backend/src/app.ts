import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.route.js';
import errorHandler from './middlewares/errorHandler.js';
import conversationRoutes from './routes/conversation.route.js';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use('/health', healthRoutes);
app.use('/conversations', conversationRoutes);

export default app;
