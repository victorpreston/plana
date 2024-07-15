import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT } from './config/env.config';
import prisma from './config/db'; 
import userRoutes from './routes/user.routes'; 
import eventRoutes from './routes/event.routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Plana API is running!');
});

// Use user routes
app.use('/api', userRoutes);
// Use event routes
app.use('/api', eventRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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