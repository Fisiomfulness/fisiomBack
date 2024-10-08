const { ORIGIN_ALLOWED, FRONT_URL, NODE_ENV } = require('./envConfig');

const optionCors = {
  origin: (origin, callback) => {
    if (!origin) {
      // alowed only on development environment
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
