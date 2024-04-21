// @ts-check
const { model } = require('mongoose');

/**
 * @typedef {import('mongoose').FilterQuery<import('mongoose').Document>} MongoFilter
 *
 * @typedef {{
 *   field: string,
 *   operator: string,
 *   value: string,
 * }} Filter
 *
 * @typedef {{
 *   orderBy: string,
 *   orderType: "asc" | "desc" | "none",
 * }} Order
 *
 * @typedef {{
 *   filters: Filter[],
 *   order: Order
 *   limit: number,
 *   offset: number,
 * }} Criteria
 */

/**
 * @param {Criteria} criteria
 * @param {string} collectionName
 */
async function matching(criteria, collectionName) {
  const query = criteriaConverter(criteria);

  return model(collectionName)
    .find(query.filter, {})
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit);
}

/**
 * @param {Criteria} criteria
 * @returns {{
 *   filter: MongoFilter,
 *   sort: { [key: string]: import('mongoose').SortOrder },
 *   skip: number,
 *   limit: number,
 * }}
 */
function criteriaConverter(criteria) {
  const { filters, limit, order, offset } = criteria;

  return {
    filter: filters.length ? generateFilter(filters) : {},
    sort: order.orderType !== 'none' ? generateSort(order) : { _id: -1 },
    skip: offset || 0,
    limit: limit || 0,
  };
}

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
 * @param {Order} order
 * @returns {{ [key: string]: import('mongoose').SortOrder }}
 */
const generateSort = (order) => {
  return {
    [order.orderBy === 'id' ? '_id' : order.orderBy]:
      order.orderType === 'asc' ? 1 : -1,
  };
};

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

module.exports = { matching };
