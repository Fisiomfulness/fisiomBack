// @ts-check
const { DomainEvent } = require('#src/modules/event/models/DomainEvent');
const {
  EVENT_PUBLIC_CHAT_CREATED,
} = require('#src/modules/event/models/EventSymbols');
const {
  internalEventBus,
} = require('#src/modules/event/models/InternalEventBus');
const { SocketEventBus } = require('#src/modules/event/models/SocketEventBus');
const { newRooms } = require('#src/state');
const { Server: SocketServer } = require('socket.io');

/** @typedef {import("node:http").Server} Server */

class SocketApplication {
  /**
   * @param {Server} httpServer
   * @param {number=} port
   */
  constructor(httpServer, port = 3000) {
    /** @readonly @type {number} */
    this.port = port;
    /** @readonly @type {Server} */
    this.httpServer = httpServer;
    /** @readonly @type {SocketServer} */
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: 'http://localhost:3001',
      },
    });
  }

  async start() {
    await this.httpServer.listen(this.port);

    console.log(
      `Ejecutando socket en el puerto ${this.port} en modo ${process.env.NODE_ENV}`,
    );

    this.#configureExternalEventBus();
  }

  stop() {
    if (this.httpServer) {
      this.httpServer.close();
    }
  }

  #configureExternalEventBus() {
    this.io.on('connection', (socket) => {
      console.log('new connection');

      // HACK: esto adapta los eventos que vengan del exterior
      socket.use((packet, next) => {
        const name = packet[0];
        const data = packet.pop();
        const { eventId, occurredOn, eventName, aggregateId, ...safeEvent } =
          data;

        packet.push(
          new (class extends DomainEvent {
            constructor() {
              super({ eventName: name, aggregateId: aggregateId });
              Object.assign(this, safeEvent);
            }
          })(),
        );

        next();
      });

      const externalEventBus = new SocketEventBus(socket);
      externalEventBus.registerEvents();

      /** @param {*} event */
      const handlePublicChatCreated = (event) => {
        externalEventBus.publish(event);
        console.log(event.eventName, 'enviado al `event bus` externo');
      };

      internalEventBus.subscribe(
        EVENT_PUBLIC_CHAT_CREATED,
        handlePublicChatCreated,
      );

      socket.on('disconnect', () => {
        console.log('disconnect');

        internalEventBus.unsubscribe(
          EVENT_PUBLIC_CHAT_CREATED,
          handlePublicChatCreated,
        );

        const id = socket.id;
        this.#getUserRooms(id).forEach((roomName) => {
          const room = newRooms.get(roomName);
          if (!room) return;

          const users = room.users;

          socket.broadcast.to(roomName).emit('user-disconnected', users[id]);
          delete users[id];
        });
      });
    });
  }

  /** @param {string} id */
  #getUserRooms(id) {
    /** @type {string[]} */
    const res = [];
    newRooms.forEach((value, key) => {
      if (value.users[id]) res.push(key);
    });
    return res;

    // return Object.entries(rooms).reduce(
    //   (names, [name, room]) => {
    //     if (room.users[socket.id] != null) names.push(name);
    //     return names;
    //   },
    //   /** @type {string[]} */ ([]),
    // );
  }
}

module.exports = { SocketApplication };
