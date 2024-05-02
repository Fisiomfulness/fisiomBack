// @ts-check
const { Filter } = require('./filter');
const { Order } = require('./order');

class Criteria {
  /**
   * @param {Filter[]} filters
   * @param {Order} order
   * @param {number=} limit
   * @param {number=} offset
   */
  constructor(filters, order, limit, offset) {
    /** @readonly @type {Filter[]} */
    this.filters = filters;
    /** @readonly @type {Order} */
    this.order = order;
    /** @readonly @type {number=} */
    this.limit = limit;
    /** @readonly @type {number=} */
    this.offset = offset;
  }
}

class CriteriaQuery extends Criteria {
  /**
   * @param {any[]} filters
   * @param {string=} orderBy
   * @param {string=} orderType
   * @param {number=} limit
   * @param {number=} offset
   */
  constructor(filters, orderBy, orderType, limit, offset) {
    super(
      filters.map(Filter.fromValues),
      Order.fromValues(orderBy, orderType),
      limit,
      offset,
    );
  }
}

module.exports = {
  Criteria,
  CriteriaQuery,
};
