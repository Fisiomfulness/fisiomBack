// @ts-check
const { InvalidArgumentError } = require('#src/util/errors');

const OrderTypes = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
  NONE: 'none',
});

/**
 * @typedef {OrderTypes[keyof OrderTypes]} OrderType
 * @typedef {{
 *   orderBy: string,
 *   orderType: OrderType
 * }} Order
 */

/**
 * @param {string} value
 * @returns {OrderType}
 */
const orderTypeFromValue = (value) => {
  for (const orderType of Object.values(OrderTypes)) {
    if (value === orderType) {
      return value;
    }
  }

  throw new InvalidArgumentError(`El tipo de orden '${value}' es invalido`);
};

/**
 * @param {string} [orderBy]
 * @param {string} [orderType]
 * @returns {Order}
 */
const orderFromValues = (orderBy, orderType) => {
  if (!orderBy) {
    return { orderBy: '', orderType: OrderTypes.NONE };
  }

  return {
    orderBy: orderBy,
    orderType: orderTypeFromValue(orderType || OrderTypes.ASC),
  };
};

module.exports = {
  OrderTypes,
  orderTypeFromValue,
  orderFromValues,
};
