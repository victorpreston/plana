import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { env } from './config/env.config';
import profileRoutes from './routes/profile.routes';
import categoryRoutes from './routes/category.routes';
import tagRoutes from './routes/tag.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import prisma from './config/database.config';
import roleRoutes from './routes/role.routes';
import searchRoutes from './routes/search.routes';
import logger from './config/logger.config';

const app = express();
const port = env.port;

/**
 * Configure CORS
 */
const corsOptions = {
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', profileRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', eventRoutes);
app.use('/api', bookingRoutes);
app.use('/api', roleRoutes);
app.use('/api', searchRoutes);

app.get('/api/health', (req, res) => res.status(200).json({ message: 'OK' })); 

/* Health check endpoint */
const server = app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});

/**
 * Graceful shutdown
 */
const gracefulShutdown = (signal: string) => {
  process.on(signal, () => {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(async () => {
      console.log('HTTP server closed');
      await prisma.$disconnect();
    });
  });
};

gracefulShutdown('SIGTERM');
gracefulShutdown('SIGINT');
