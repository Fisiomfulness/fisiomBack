// @ts-check
const { PublicChatCreatedEvent } = require('./PublicChatCreatedEvent');

/**
 * @typedef {import(
 *   '../../event/models/IEventSubscriber').IEventSubscriber
 * } IEventSubscriber
 * @typedef {import("../../event/models/IEventBus").IEventBus} IEventBus
 */

/** @implements {IEventSubscriber} */
class PublicChatCreatedSubscriber {
  subscribedTo = PublicChatCreatedEvent;

  /** @param {IEventBus} externalEventBus */
  constructor(externalEventBus) {
    /** @readonly @type {IEventBus} */
    this.externalEventBus = externalEventBus;

    // NOTE: https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
    this.on = this.on.bind(this);
  }

  /** @param {PublicChatCreatedEvent} event */
  on(event) {
    this.externalEventBus.publish(event);
    console.log(this.subscribedTo.name, 'enviado al `event bus` externo');
  }
}

module.exports = { PublicChatCreatedSubscriber };
