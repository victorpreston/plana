import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  logLevel: process.env.LOG_LEVEL || 'info',
  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: Number(process.env.EMAIL_PORT) || 587,
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
};