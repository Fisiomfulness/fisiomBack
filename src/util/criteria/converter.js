// @ts-check
const { OrderTypes } = require('./order');

/**
 * @typedef {import('mongoose').FilterQuery<import('mongoose').Document>} MongoFilter
 * @typedef {import('./order').Order} Order
 * @typedef {import('./filters').Filter} Filter
 */

const filterTransformer = new Map(
  /** @type {Array<[string, (filter: Filter) => MongoFilter] >} */
  ([
    ['EQ', (filter) => ({ [filter.field]: { $eq: filter.value } })],
    ['GT', (filter) => ({ [filter.field]: { $gt: filter.value } })],
    ['LT', (filter) => ({ [filter.field]: { $lt: filter.value } })],
    ['NE', (filter) => ({ [filter.field]: { $ne: filter.value } })],
    ['NOT', (filter) => ({ [filter.field]: { $not: filter.value } })],
    ['CONTAINS', (filter) => ({ [filter.field]: { $regex: filter.value } })],
  ]),
);

/**
 * @param {Filter[]} filters
 * @returns {MongoFilter}
 */
const generateFilter = (filters) => {
  const filter = filters.map((filter) => {
    const transformer = filterTransformer.get(filter.operator);

    if (!transformer) {
      throw new Error(`Valor inesperado del operador: ${filter.operator}`);
    }

    return transformer(filter);
  });

  return Object.assign({}, ...filter);
};

/**
 * @param {Order} order
 * @returns {Record<string, 1 | -1>}
 */
const generateSort = (order) => {
  return {
    [order.orderBy === 'id' ? '_id' : order.orderBy]:
      order.orderType === 'asc' ? 1 : -1,
  };
};

/**
 * @param {import('../criteria').Criteria} criteria
 * @returns {{
 *   filter: MongoFilter,
 *   sort: Record<string, 1 | -1>,
 *   skip: number,
 *   limit: number,
 * }}
 */
function criteriaConverter(criteria) {
  const { filters, limit, order, offset } = criteria;

  return {
    filter: filters.length ? generateFilter(filters) : {},
    sort:
      order.orderType !== OrderTypes.NONE ? generateSort(order) : { _id: -1 },
    skip: offset || 0,
    limit: limit || 20,
  };
}

module.exports = {
  criteriaConverter,
};
