import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

/**
 * Load environment variables from .env file
 * 
 * Set the configuration for the database connection
 */
dotenv.config();

const prisma = new PrismaClient();

export default prisma;