// @ts-check
const { z } = require('zod');

const NODE_ENV = process.env.NODE_ENV;
const envPaths = [
  '.env',
  NODE_ENV ? `.env.${NODE_ENV}` : '',
  'env.local',
  NODE_ENV ? `.env.${NODE_ENV}.local` : '',
];

envPaths.forEach((envPath) => {
  if (envPath) {
    require('dotenv').config({ path: envPath });
  }
});

console.info('Orden de carga de variables de entorno:', envPaths);

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().min(0).max(65535).default(3000),
  MONGODB_URL: z.string().nonempty(),
  MAIL_HOST: z.string().nonempty(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string().nonempty(),
  MAIL_PASSWORD: z.string().nonempty(),
  DEFAULT_USER_IMAGE: z
    .string()
    .nonempty()
    .default(
      'https://res.cloudinary.com/diypmot81/image/upload/v1689621612/FisiumFulness/users/profile_ifkavf.jpg',
    ),
  CLOUDINARY_NAME: z.string().nonempty(),
  CLOUDINARY_KEY: z.string().nonempty(),
  CLOUDINARY_SECRET: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  JWT_SECRET_REFRESH: z.string().nonempty(),
  OPEN_CAGE: z.string().nonempty(),
  FRONT_URL: z.string().nonempty(),
  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),
});

const envVars = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  DEFAULT_USER_IMAGE: process.env.DEFAULT_USER_IMAGE,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH,
  OPEN_CAGE: process.env.OPEN_CAGE,
  FRONT_URL: process.env.FRONT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

if (!envVars.success) {
  const { fieldErrors } = envVars.error.flatten();
  console.error('Variables de entorno no válidas:');
  for (const [field, errors] of Object.entries(fieldErrors)) {
    console.error(`  ${field}: ${errors.join(', ')}`);
  }
  process.exit(1);
}

module.exports = { ...envVars.data };
