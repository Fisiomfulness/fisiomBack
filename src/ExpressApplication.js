// @ts-check
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
require('./config/authGoogle');

const routes = require('#src/routes/index');
const { optionCors } = require('#src/config/corsConfig');
const { errorHandler } = require('#src/util/errorHandler');

/** @typedef {import("node:http").Server} Server */

class ExpressApplication {
  /** @type {Server=} */
  httpServer;

  /** @param {number} port */
  constructor(port) {
    /** @readonly @type {number} */
    this.port = port;
    /** @readonly @type {import('express').Express} */
    this.express = express();

    // Middleware
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors(optionCors));
    this.express.use(cookieParser());
    this.express.use(morgan('dev'));
    this.express.use(compression());

    // Configura las sesiones antes de las rutas
    this.express.use(
      session({
        secret: 'tu_secreto', // Cambia esto por un valor seguro en producción
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true }, // Cambia secure a true en producción
      }),
    );

    // Inicializa Passport.js
    this.express.use(passport.initialize());
    this.express.use(passport.session());

    // Rutas
    this.express.use('/', routes);

    // Middleware de manejo de errores
    this.express.use(errorHandler);
  }

  async start() {
    try {
      this.httpServer = await this.express.listen(this.port);
      console.log(
        `Ejecutando express en el puerto ${this.port} en modo ${this.express.get('env')}`,
      );
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
    }
  }

  stop() {
    if (this.httpServer) {
      this.httpServer.close();
      console.log('Servidor detenido.');
    }
  }
}

module.exports = { ExpressApplication };
