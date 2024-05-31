// @ts-check
const { rooms } = require('#src/state');
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
    console.log(event);

    const { username, roomName, eventId } = event;

    const roomNameExists = rooms[roomName] != null;
    if (!roomNameExists) {
      return console.log(`room: ${roomName} no existe`);
    }

    this.socket.join(roomName);
    rooms[roomName].users[this.socket.id] = username;
    this.socket.broadcast.to(roomName).emit('user-connected', username);

    console.log(`ID: ${eventId} - ${username} conectado a ${roomName}`);
  }
}

module.exports = { UserConnectedSubscriber };
