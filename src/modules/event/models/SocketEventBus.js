// @ts-check
const {
  EVENT_USER_CONNECTED,
  EVENT_MESSAGE_SENDED,
} = require('./EventSymbols');
const { newRooms } = require('#src/state');
const { DomainEvent } = require('./DomainEvent');

/**
 * @typedef {import("./IEventBus").IEventBus} IEventBus
 * @typedef {import('socket.io').Socket} Socket
 * @typedef {import(
 *   '#src/modules/chat/models/UserConnectedEvent').UserConnectedEvent
 * } UserConnectedEvent
 * @typedef {import(
 *   '#src/modules/chat/models/MessageSendedEvent').MessageSendedEvent
 * } MessageSendedEvent
 */

/** @implements {IEventBus} */
class SocketEventBus {
  /** @param {Socket} socket */
  constructor(socket) {
    /** @type {Socket} socket */
    this.socket = socket;
  }

  /** @param {DomainEvent} event */
  publish(event) {
    this.socket.emit(event.eventName, event);
  }

  /**
   * @param {string} name
   * @param {(data: DomainEvent) => void} handler
   */
  subscribe(name, handler) {
    this.socket.on(name, handler);
  }

  /**
   * @param {string} name
   * @param {(data: DomainEvent) => void} handler
   */
  unsubscribe(name, handler) {
    this.socket.off(name, handler);
  }

  registerEvents() {
    // TODO: refactorizar los manejadores
    this.subscribe(EVENT_USER_CONNECTED, this.#handleUserConnected);
    this.subscribe(EVENT_MESSAGE_SENDED, this.#handleMessageSended);
  }

  // NOTE: https://github.com/tc39/proposal-private-methods/issues/11
  /** @param {UserConnectedEvent | *} event */
  #handleUserConnected = (event) => {
    const { username, roomName, eventId, eventName } = event;

    const room = newRooms.get(roomName);

    if (!room) {
      return console.log(`room: ${roomName} no existe`);
    }

    const { socket } = this;
    const id = socket.id;

    socket.join(roomName);
    room.users[id] = username;
    socket.broadcast.to(roomName).emit(eventName, username);

    console.log(`ID: ${eventId} - ${username} conectado a ${roomName}`);
  };

  /** @param {MessageSendedEvent | *} event */
  #handleMessageSended = (event) => {
    const { message, sendBy, room, eventId } = event;

    const existingRoom = newRooms.get(room);

    if (!existingRoom) {
      return console.log(`room: ${room} no existe`);
    }

    const { socket } = this;
    const id = socket.id;

    // TODO: separar eventos `sended` and `new`
    socket.broadcast.to(room).emit('message:new', {
      message: message,
      name: existingRoom.users[id],
    });

    console.log(`ID: ${eventId} - ${sendBy}: ${message}`);
  };
}

module.exports = { SocketEventBus };
