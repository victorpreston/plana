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

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
  });
});
