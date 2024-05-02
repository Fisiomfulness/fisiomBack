module.exports = {
  PORT: process.env.PORT || 3000,

  DB_SERVER: process.env.DB_SERVER,

  MAIL_HOST: process.env.MAILHOST,
  MAIL_PORT: process.env.MAILPORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,

  DEFAULT_USER_IMAGE: process.env.URL_PROFILE_DEFAULT,

  CLOUDINARY_NAME: process.env.cloud_name,
  CLOUDINARY_KEY: process.env.api_key,
  CLOUDINARY_SECRET: process.env.api_secret,

  JWT_SECRET: process.env.JWT_secret,

  OPEN_CAGE: process.env.OPEN_CAGE,

  FRONT_URL: process.env.FRONT_URL,
};
