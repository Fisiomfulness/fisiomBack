// @ts-check
const { v4: uuid } = require('uuid');

// TODO: evaluar si es necesario que todos los eventos incluyan `aggregateId`

/** @abstract */
class DomainEvent {
  /** @readonly @type {Date} */
  occurredOn = new Date();
  /** @readonly @type {string} */
  eventId = uuid();

  /**
   * @param {{
   *   eventName: string,
   *   aggregateId: string
   * }} params
   */
  constructor({ eventName, aggregateId }) {
    /** @readonly @type {string} */
    this.eventName = eventName;
    /** @readonly @type {string} */
    this.aggregateId = aggregateId;
  }
}

module.exports = { DomainEvent };
