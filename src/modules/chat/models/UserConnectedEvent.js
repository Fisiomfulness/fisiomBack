// @ts-check
const { DomainEvent } = require('#src/modules/event/models/DomainEvent');
const {
  USER_CONNECTED_EVENT,
} = require('#src/modules/event/models/EventSymbols');

class UserConnectedEvent extends DomainEvent {
  /** @override */
  static EVENT_NAME = USER_CONNECTED_EVENT;

  /**
   * @param {{
   *   username: string,
   *   roomName: string
   * }} params
   */
  constructor({ username, roomName }) {
    super({
      eventName: UserConnectedEvent.EVENT_NAME,
      aggregateId: '123',
    });

    /** @readonly @type {string} */
    this.username = username;
    /** @readonly @type {string} */
    this.roomName = roomName;
  }
}

module.exports = { UserConnectedEvent };
