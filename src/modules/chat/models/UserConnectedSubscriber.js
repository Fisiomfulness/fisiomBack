// @ts-check
const { newRooms } = require('#src/state');
const { UserConnectedEvent } = require('./UserConnectedEvent');

/**
 * @typedef {import(
 *   '../../event/models/IEventSubscriber').IEventSubscriber
 * } IEventSubscriber
 * @typedef {import('socket.io').Socket} Socket
 */

/** @implements {IEventSubscriber} */
class UserConnectedSubscriber {
  subscribedTo = UserConnectedEvent;

  /** @param {Socket} socket */
  constructor(socket) {
    /** @readonly @type {Socket} */
    this.socket = socket;

    this.on = this.on.bind(this);
  }

  /** @param {UserConnectedEvent} event */
  on(event) {
    const { username, roomName, eventId } = event;

    const room = newRooms.get(roomName);

    if (!room) {
      return console.log(`room: ${roomName} no existe`);
    }

    const { socket } = this;
    const id = socket.id;

    socket.join(roomName);
    room.users[id] = username;
    socket.broadcast.to(roomName).emit(this.subscribedTo.EVENT_NAME, username);

    console.log(`ID: ${eventId} - ${username} conectado a ${roomName}`);
  }
}

module.exports = { UserConnectedSubscriber };
