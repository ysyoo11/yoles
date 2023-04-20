const [envList] = ['MONGODB_URI', 'MONGODB_NAME'] as const;

export const ENV = {
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_NAME: process.env.MONGODB_NAME,
} as { [key in (typeof envList)[number]]: string };

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';