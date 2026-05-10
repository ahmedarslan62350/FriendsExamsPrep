import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  port: parseInt(getEnv('PORT', '5000'), 10),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  mongodbUri: getEnv('MONGODB_URI'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
  clientUrl: getEnv('CLIENT_URL', 'http://localhost:3000'),
  adminEmail: getEnv('ADMIN_EMAIL', 'ahmedarslanarslan9@gmail.com').toLowerCase(),
};
