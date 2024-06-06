// @ts-check
const EventEmitter = require('node:events');

/**
 * @typedef {import("./IEventBus").IEventBus} IEventBus
 * @typedef {import('./DomainEvent').DomainEvent} DomainEvent
 */

/** @implements {IEventBus} */
class InternalEventBus extends EventEmitter {
  /** @param {DomainEvent} event */
  publish(event) {
    this.emit(event.eventName, event);
  }

  /**
   * @param {string} name
   * @param {(data: DomainEvent) => void} handler
   */
  subscribe(name, handler) {
    this.on(name, handler);
  }

  /**
   * @param {string} name
   * @param {(data: DomainEvent) => void} handler
   */
  unsubscribe(name, handler) {
    this.off(name, handler);
  }
}

module.exports = {
  internalEventBus: new InternalEventBus(),
};

/**
 * @example
 *
 * const { DomainEvent } = require('./DomainEvent');
 *
 * class TestEvent extends DomainEvent {
 *   message = 'test';
 *
 *   constructor() {
 *     super({
 *       eventName: "test.event",
 *       aggregateId: '123'
 *     });
 *   }
 * }
 *
 * const eventBus = new InternalEventBus();
 *
 * const handleTestEvent = (event) => {
 *   console.log('testEventSubscriber', event);
 * };
 *
 * eventBus.subscribe("test.event", handleTestEvent);
 *
 * eventBus.publish(new TestEvent());
 *
 * console.log(eventBus.eventNames());
 *
 * eventBus.unsubscribe("test.event", handleTestEvent);
 */
