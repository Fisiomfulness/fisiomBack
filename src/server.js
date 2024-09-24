// @ts-check
const { createServer } = require("node:http");
const { SocketApplication } = require("./SocketApplication");
const { ExpressApplication } = require("./ExpressApplication");
require("./tasks/cron");

/** @typedef {import('express').Express} Express */

class Server {
  /** @param {number} port */
  constructor(port) {
    /** @readonly @type {number} */
    this.port = port;

    /** @readonly @type {Express} */
    this.expressServer = new ExpressApplication(this.port).express;

    const httpServer = createServer(this.expressServer);
    /** @readonly @type {SocketApplication} */
    this.socketApplication = new SocketApplication(httpServer, this.port);
  }

  async start() {
    this.configureEventBus();

    await this.socketApplication.start();
  }

  stop() {
    if (this.socketApplication) {
      this.socketApplication.stop();
    }
  }

  configureEventBus() {}
}

module.exports = { Server };
