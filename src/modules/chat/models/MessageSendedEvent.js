// @ts-check
const { DomainEvent } = require('#src/modules/event/models/DomainEvent');
const {
  MESSAGE_SENDED_EVENT,
} = require('#src/modules/event/models/EventSymbols');

class MessageSendedEvent extends DomainEvent {
  /** @override */
  static EVENT_NAME = MESSAGE_SENDED_EVENT;

  /**
   * @param {{
   *   aggregateId: string,
   *   message: string,
   *   sendBy: string,
   *   room: string
   * }} params
   */
  constructor({ aggregateId, message, sendBy, room }) {
    super({ eventName: MessageSendedEvent.EVENT_NAME, aggregateId });

    /** @readonly @type {string} */
    this.message = message;
    /** @readonly @type {string} */
    this.sendBy = sendBy;
    /** @readonly @type {string} */
    this.room = room;
  }
}

module.exports = { MessageSendedEvent };
