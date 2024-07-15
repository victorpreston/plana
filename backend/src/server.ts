import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT } from './config/env.config';
import prisma from './config/db';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Plana API is running!');
});

/**
 * Start the server
 */
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(async () => {
    console.log('HTTP server closed')
    await prisma.$disconnect()
  })
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(async () => {
    console.log('HTTP server closed')
    await prisma.$disconnect()
  })
});