// @ts-check

/**
 * @typedef {import('./DomainEvent').DomainEvent} DomainEvent
 * @typedef {import('./DomainEvent').DomainEventStatic} DomainEventStatic
 * @typedef {import('./IEventSubscriber').IEventSubscriber} IEventSubscriber
 */

/**
 * @template {DomainEvent} T
 * @implements {IEventSubscriber}
 */
class EventSubscriber {
  /**
   * @param {DomainEventStatic} event
   * @param {(event: T) => void} onEvent
   */
  constructor(event, onEvent) {
    /** @readonly @type {DomainEventStatic} */
    this.subscribedTo = event;
    /** @readonly @type {(event: T) => void} */
    this.on = onEvent;
  }
}

module.exports = { EventSubscriber };
