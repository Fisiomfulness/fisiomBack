// @ts-check
const { DomainEvent } = require('#src/modules/event/models/DomainEvent');
const {
  EVENT_PUBLIC_CHAT_CREATED,
} = require('#src/modules/event/models/EventSymbols');

class PublicChatCreatedEvent extends DomainEvent {
  /** @param {{ roomName: string }} params */
  constructor({ roomName }) {
    super({
      eventName: EVENT_PUBLIC_CHAT_CREATED,
      aggregateId: '123',
    });

    /** @readonly @type {string} */
    this.roomName = roomName;
  }
}

module.exports = { PublicChatCreatedEvent };
