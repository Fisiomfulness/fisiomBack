// @ts-check
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path')

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

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors(optionCors));
    this.express.use(cookieParser());
    this.express.use(morgan('dev'));
    this.express.use(compression());
    this.express.use('/', routes);

    this.express.use(errorHandler);
  }

  async start() {
    this.httpServer = await this.express.listen(this.port);

    console.log(
      `Ejecutando express en el puerto ${this.port} en modo ${this.express.get(
        'env',
      )}`,
    );
  }

  stop() {
    if (this.httpServer) {
      this.httpServer.close();
    }
  }
}

module.exports = { ExpressApplication };
