// @ts-check
const { DomainEvent } = require('#src/modules/event/models/DomainEvent');
const {
  PUBLIC_CHAT_CREATED_EVENT,
} = require('#src/modules/event/models/EventSymbols');

class PublicChatCreatedEvent extends DomainEvent {
  /** @override */
  static EVENT_NAME = PUBLIC_CHAT_CREATED_EVENT;

  /** @param {{ roomName: string }} params */
  constructor({ roomName }) {
    super({
      eventName: PublicChatCreatedEvent.EVENT_NAME,
      aggregateId: '123',
    });

    /** @readonly @type {string} */
    this.roomName = roomName;
  }
}

module.exports = { PublicChatCreatedEvent };
