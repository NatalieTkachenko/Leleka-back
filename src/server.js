import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { connectMongoDB } from './db/connectMongoDB.js';

import authRoutes from './routes/authRoutes.js';

import usersRoutes from './routes/usersRoutes.js';
import tasksRouter from './routes/tasksRoutes.js';
import diariesRouts from './routes/diariesRouts.js';
import weeksRoutes from './routes/weeksRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;
const isDev = process.env.NODE_ENV !== 'production';

/* ========= Middleware ========= */
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(cookieParser());

app.use(
  isDev
    ? pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      })
    : pino(),
);

/* ========= Routes ========= */
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', tasksRouter);
app.use('/api', diariesRouts);
app.use('/api', weeksRoutes);

// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     service: 'Stork-Helpers API',
//   });
// });

// app.use('/api', weeksRoutes);

// app.use('/api/tasks', tasksRouter);

/* ========= 404 ========= */
app.use((req, res) => {
  res.status(404).json({ message: 'Not found route' });
});
/* ========= Error handler ========= */
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

/* ========= Start ========= */
const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
  });
};

startServer();
