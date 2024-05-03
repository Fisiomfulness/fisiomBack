// @ts-check
const { InvalidArgumentError } = require('#src/util/errors');

/** @enum {"asc" | "desc" | "none"} */
const OrderType = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
  NONE: 'none',
  /**
   * @param {string} value
   * @returns {OrderType}
   */
  fromValue: function (value) {
    for (const orderType of Object.values(this)) {
      if (value === orderType) {
        return value;
      }
    }

    throw new InvalidArgumentError(`El tipo de orden '${value}' es invalido`);
  },
});

class Order {
  /**
   * @param {string} orderBy
   * @param {OrderType} orderType
   */
  constructor(orderBy, orderType) {
    /** @readonly @type {string} */
    this.orderBy = orderBy;
    /** @readonly @type {OrderType} */
    this.orderType = orderType;
  }

  /**
   * @param {string} [orderBy]
   * @param {string} [orderType]
   */
  static fromValues(orderBy, orderType) {
    if (!orderBy) {
      return Order.none();
    }

    return new Order(orderBy, OrderType.fromValue(orderType || OrderType.ASC));
  }

  static none() {
    return new Order('', OrderType.NONE);
  }

  isAsc() {
    return this.orderType === OrderType.ASC;
  }

  hasOrder() {
    return this.orderType !== OrderType.NONE;
  }
}

module.exports = {
  Order,
  OrderType,
};
