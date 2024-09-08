const { ORIGIN_ALLOWED, FRONT_URL } = require('./envConfig');

const optionCors = {
  // origin: 'http://localhost:5173',
  // ? To work with cookies needs a fix origin
  origin: (origin, callback) => {
    if (!origin) {
      // Permitir solo en desarrollo o pruebas
      if (NODE_ENV === 'development' || NODE_ENV === 'test') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS in production'));
      }
    } else if (FRONT_URL == origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { optionCors };
