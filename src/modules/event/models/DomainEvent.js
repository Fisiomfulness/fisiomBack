// @ts-check
const { v4: uuid } = require('uuid');

/**
 * @typedef {string} DomainEventName
 * @typedef {{
 *   EVENT_NAME: DomainEventName
 * }} DomainEventStatic
 */

/** @abstract */
class DomainEvent {
  /** @type {DomainEventName} */
  static EVENT_NAME = 'domain.event';

  /** @readonly @type {Date} */
  occurredOn = new Date();
  /** @readonly @type {string} */
  eventId = uuid();

  /**
   * @param {{
   *   eventName: DomainEventName,
   *   aggregateId: string
   * }} params
   */
  constructor({ eventName, aggregateId }) {
    /** @readonly @type {DomainEventName} */
    this.eventName = eventName;
    /** @readonly @type {string} */
    this.aggregateId = aggregateId;
  }
}

module.exports = { DomainEvent };
