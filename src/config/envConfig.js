// @ts-check
const { z } = require('zod');

const NODE_ENV = process.env.NODE_ENV;
const envPaths = [
  '.env',
  NODE_ENV ? `.env.${NODE_ENV}` : '',
  'env.local',
  NODE_ENV ? `.env.${NODE_ENV}.local` : '',
];

require('dotenv').config({
  path: envPaths,
  override: true,
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

  OPEN_CAGE: z.string().nonempty(),

  FRONT_URL: z.string().nonempty(),


  MERCHANT_NAME: z.string().nonempty(),
  MERCHANT_PASSWORD: z.string().nonempty(),
  NIUBIZ_MERCHANT_ID: z.string().nonempty(),
  NIUBIZ_SECURITY_ENDPOINT: z.string().nonempty(),
  NIUBIZ_SESSION_ENDPOINT: z.string().nonempty(),
  NIUBIZ_CHECKOUT_ENDPOINT: z.string().nonempty(),
  NIUBIZ_TRANSACTION_AUTORIZATION_ENDPOINT: z.string().nonempty(),
});

/**
 * NOTE: verificar solo las variables que se usaran en el proyecto, si se pasa
 * directamente `process.env`, se verificaran junto con las variables del sistema
 */
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

  OPEN_CAGE: process.env.OPEN_CAGE,

  FRONT_URL: process.env.FRONT_URL,

  MERCHANT_NAME:process.env.MERCHANT_NAME,
  MERCHANT_PASSWORD:process.env.MERCHANT_PASSWORD,
  
  NIUBIZ_MERCHANT_ID:process.env.NIUBIZ_MERCHANT_ID,
  NIUBIZ_SECURITY_ENDPOINT:process.env.NIUBIZ_SECURITY_ENDPOINT,
  NIUBIZ_SESSION_ENDPOINT:process.env.NIUBIZ_SESSION_ENDPOINT,
  NIUBIZ_CHECKOUT_ENDPOINT:process.env.NIUBIZ_CHECKOUT_ENDPOINT,
  NIUBIZ_TRANSACTION_AUTORIZATION_ENDPOINT:process.env.NIUBIZ_TRANSACTION_AUTORIZATION_ENDPOINT,
});

if (!envVars.success) {
  const error = envVars.error;
  const { fieldErrors } = error.flatten();
  const errorMessage = Object.entries(fieldErrors).map(([field, errors]) =>
    errors ? { [field]: `${errors.join(', ')}` } : field,
  );
  console.error('Variables de entorno no validas:', errorMessage);
  process.exit(1);
}

module.exports = { ...envVars.data };
