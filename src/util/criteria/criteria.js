// @ts-check
const { model } = require('mongoose');
const { orderFromValues } = require('./order');
const { filtersFromValues } = require('./filters');
const { criteriaConverter } = require('./converter');

/**
 * @typedef {import('./order').Order} Order
 * @typedef {import('./filters').Filter} Filter
 *
 * @typedef {{
 *   filters: Filter[],
 *   order: Order,
 *   limit?: number,
 *   offset?: number,
 * }} Criteria
 */

/**
 * @param {any[]} filters
 * @param {string} [orderBy]
 * @param {string} [orderType]
 * @param {number} [limit]
 * @param {number} [offset]
 * @returns {Criteria}
 */
const createCriteriaQuery = (filters, orderBy, orderType, limit, offset) => {
  const parseFilters = filters ? filters : [];

  return {
    filters: filtersFromValues(parseFilters),
    order: orderFromValues(orderBy, orderType),
    limit: limit,
    offset: offset,
  };
};

/**
 * @param {Criteria} criteria
 * @param {string} collectionName
 * @returns {Promise<{
 *   count: number,
 *   results: import('mongoose').HydratedDocument<import('mongoose').Document>[]
 * }>}
 */
async function matching(criteria, collectionName) {
  const query = criteriaConverter(criteria);

  const count = await model(collectionName).countDocuments({
    ...query.filter,
    is_deleted: false,
  });

  const results = await model(collectionName)
    .find({ ...query.filter, is_deleted: false }, {})
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit);

  return {
    count,
    results,
  };
}

module.exports = {
  createCriteriaQuery,
  matching,
};
