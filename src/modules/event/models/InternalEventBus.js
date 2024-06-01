// @ts-check
const EventEmitter = require('node:events');

/**
 * @typedef {import("./IEventBus").IEventBus} IEventBus
 * @typedef {import('./IEventSubscriber').IEventSubscriber} IEventSubscriber
 * @typedef {import('./DomainEvent').DomainEvent} DomainEvent
 */

/** @implements {IEventBus} */
class InternalEventBus extends EventEmitter {
  /** @param {DomainEvent} event */
  publish(event) {
    this.emit(event.eventName, event);
  }

  /** @param {IEventSubscriber} subscriber */
  subscribe(subscriber) {
    this.on(subscriber.subscribedTo.EVENT_NAME, subscriber.on);
  }

  /** @param {IEventSubscriber} subscriber */
  unsubscribe(subscriber) {
    this.off(subscriber.subscribedTo.EVENT_NAME, subscriber.on);
  }
}

module.exports = {
  internalEventBus: new InternalEventBus(),
};

/**
 * @example
 * const { DomainEvent } = require('./DomainEvent');
 *
 * class TestEvent extends DomainEvent {
 *   static EVENT_NAME = 'test.event';
 *
 *   message = 'test';
 *
 *   constructor() {
 *     super({
 *       eventName: TestEvent.EVENT_NAME,
 *       aggregateId: '123'
 *     });
 *   }
 * }
 *
 * const eventBus = new InternalEventBus();
 *
 * const testEventSubscriber = new EventSubscriber(
 *   TestEvent,
 *   (event) => {
 *     console.log('testEventSubscriber', event);
 *   },
 * );
 * eventBus.subscribe(testEventSubscriber);
 *
 * eventBus.publish(new TestEvent());
 *
 * console.log(eventBus.eventNames());
 */
