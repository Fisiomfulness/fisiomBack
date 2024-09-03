// @ts-check
const { DomainEvent } = require('#src/modules/event/models/DomainEvent');
const {
  EVENT_USER_CONNECTED,
} = require('#src/modules/event/models/EventSymbols');

class UserConnectedEvent extends DomainEvent {
  /**
   * @param {{
   *   username: string,
   *   roomName: string
   * }} params
   */
  constructor({ username, roomName }) {
    super({
      eventName: EVENT_USER_CONNECTED,
      aggregateId: '123',
    });

    /** @readonly @type {string} */
    this.username = username;
    /** @readonly @type {string} */
    this.roomName = roomName;
  }
}

module.exports = { UserConnectedEvent };
