const optionCors = {
  // origin: 'http://localhost:5173',
  // ? To work with cookies needs a fix origin
  origin: 'https://fisiom-front.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { optionCors };
