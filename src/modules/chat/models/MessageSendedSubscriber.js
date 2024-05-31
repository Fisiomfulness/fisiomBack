// @ts-check
const {
  MessageSendedEvent,
} = require('#src/modules/chat/models/MessageSendedEvent');
const { rooms } = require('#src/state');

// const { createClient } = require('@libsql/client');
// (async () => await db.execute(`
//   CREATE TABLE IF NOT EXISTS messages (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//     message TEXT NOT NULL
//   )
// `))();

/**
 * @typedef {import(
 *   '../../event/models/IEventSubscriber').IEventSubscriber
 * } IEventSubscriber
 * @typedef {import('socket.io').Socket} Socket
 */

/** @implements {IEventSubscriber} */
class MessageSendedSubscriber {
  subscribedTo = MessageSendedEvent;

  /** @param {Socket} socket */
  constructor(socket) {
    /** @readonly @type {Socket} */
    this.socket = socket;

    this.on = this.on.bind(this);
  }

  /** @param {MessageSendedEvent} event */
  on(event) {
    console.log(event);

    const { message, sendBy, room, eventId } = event;

    // #saveToDb(message);

    this.socket.broadcast.to(room).emit('chat-message', {
      message: message,
      name: rooms[room].users[this.socket.id],
    });

    console.log(`ID: ${eventId} - ${sendBy}: ${message}`);
  }

  // #saveToDb(message) {
  //   try {
  //     const result = await db.execute({
  //       sql: 'INSERT INTO messages (message) VALUES (:message)',
  //       args: { message: message },
  //     });
  //     result.lastInsertRowid.toString(),
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}

module.exports = { MessageSendedSubscriber };
