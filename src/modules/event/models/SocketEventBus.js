// @ts-check
const { v4: uuid } = require('uuid');
const {
  MessageSendedSubscriber,
} = require('#src/modules/chat/models/MessageSendedSubscriber');
const {
  UserConnectedSubscriber,
} = require('#src/modules/chat/models/UserConnectedSubscriber');

/**
 * @typedef {import("./IEventBus").IEventBus} IEventBus
 * @typedef {import('./IEventSubscriber').IEventSubscriber} IEventSubscriber
 * @typedef {import('./DomainEvent').DomainEvent} DomainEvent
 * @typedef {import('socket.io').Socket} Socket
 */

// TODO: el binding se debe implementar en cada subscriber

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

  /** @param {IEventSubscriber} subscriber */
  subscribe(subscriber) {
    this.socket.on(subscriber.subscribedTo.EVENT_NAME, (event) => {
      const { eventId, occurredOn } = event;

      // TODO: generar id y fecha si no lo incluye el cliente
      if (!eventId) event.eventId = uuid();
      if (!occurredOn) event.occurredOn = new Date();

      subscriber.on(event);
    });
  }

  /** @param {IEventSubscriber} subscriber */
  unsubscribe(subscriber) {
    this.socket.off(subscriber.subscribedTo.EVENT_NAME, subscriber.on);
  }

  registerEvents() {
    this.subscribe(new UserConnectedSubscriber(this.socket));
    this.subscribe(new MessageSendedSubscriber(this.socket));
  }
}

module.exports = { SocketEventBus };
