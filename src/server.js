// @ts-check
const { createServer } = require('node:http');
const { SocketApplication } = require('./models/SocketApplication');
const { ExpressApplication } = require('./models/ExpressApplication');

/** @typedef {import('express').Express} Express */

class Server {
  /** @type {SocketApplication=} */
  socketApplication;
  /** @readonly @type {Express} */
  expressServer = new ExpressApplication(3006).express;

  /** @param {number} port */
  constructor(port) {
    /** @readonly @type {number} */
    this.port = port;
  }

  async start() {
    const httpServer = createServer(this.expressServer);
    this.socketApplication = new SocketApplication(httpServer, this.port);

    this.configureEventBus();

    await this.socketApplication.start();
  }

  stop() {
    if (this.socketApplication) {
      this.socketApplication.stop();
    }
  }

  configureEventBus() {
    // const internalEventBus = container.resolve('internalEventBus');
    // internalEventBus.subscribe(new MessageSendedSubscriber());
  }
}

module.exports = { Server };
