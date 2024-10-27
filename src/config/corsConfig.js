const { ORIGIN_ALLOWED, FRONT_URL, NODE_ENV } = require('./envConfig');

const optionCors = {
  origin: (origin, callback) => {
    if (!origin || (NODE_ENV === 'development' || NODE_ENV === 'test' || NODE_ENV === 'production')) {
      callback(null, true);
    } else if (origin && (FRONT_URL === origin || origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      console.log(origin);
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
