// @ts-check
const { DomainEvent } = require('#src/modules/event/models/DomainEvent');
const {
  EVENT_MESSAGE_SENDED,
} = require('#src/modules/event/models/EventSymbols');

class MessageSendedEvent extends DomainEvent {
  /**
   * @param {{
   *   aggregateId: string,
   *   message: string,
   *   sendBy: string,
   *   room: string
   * }} params
   */
  constructor({ aggregateId, message, sendBy, room }) {
    super({ eventName: EVENT_MESSAGE_SENDED, aggregateId });

    /** @readonly @type {string} */
    this.message = message;
    /** @readonly @type {string} */
    this.sendBy = sendBy;
    /** @readonly @type {string} */
    this.room = room;
  }
}

module.exports = { MessageSendedEvent };
