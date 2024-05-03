// @ts-check
const { FilterOperator } = require('#src/util/criteria/filter');

/**
 * @typedef {import('mongoose').FilterQuery<import('mongoose').Document>} MongoFilter
 * @typedef {Record<string, 1 | -1>} MongoSort
 * @typedef {import('#src/util/criteria/criteria').Criteria} Criteria
 * @typedef {{
 *   filter: MongoFilter,
 *   sort: MongoSort,
 *   skip: number,
 *   limit: number,
 * }} MongoQuery
 *
 * @typedef {import('#src/util/criteria/order').Order} Order
 * @typedef {import('#src/util/criteria/filter').Filter} Filter
 */

class MongoCriteriaConverter {
  #filterTransformer = new Map(
    /** @type {Array<[string, (filter: Filter) => MongoFilter] >} */
    ([
      [FilterOperator.EQUAL, (filter) => ({ [filter.field]: { $eq: filter.value } })],
      [FilterOperator.GT, (filter) => ({ [filter.field]: { $gt: filter.value } })],
      [FilterOperator.LT, (filter) => ({ [filter.field]: { $lt: filter.value } })],
      [FilterOperator.NOT_EQUAL, (filter) => ({ [filter.field]: { $ne: filter.value } })],
      [FilterOperator.NOT_CONTAINS, (filter) => ({ [filter.field]: { $not: filter.value } })],
      [FilterOperator.CONTAINS, (filter) => ({ [filter.field]: { $regex: filter.value } })],
    ]),
  );

  /**
   * @param {Criteria} criteria
   * @returns {MongoQuery}
   */
  convert(criteria) {
    const { filters, limit, order, offset } = criteria;

    return {
      filter: filters.length ? this._generateFilter(filters) : {},
      sort: order.hasOrder() ? this._generateSort(order) : { _id: -1 },
      skip: offset || 0,
      limit: limit || 20,
    };
  }

  /**
   * @protected
   * @param {Filter[]} filters
   * @returns {MongoFilter}
   */
  _generateFilter(filters) {
    const filter = filters.map((filter) => {
      const transformer = this.#filterTransformer.get(filter.operator);

      if (!transformer) {
        throw new Error(`Valor inesperado del operador: ${filter.operator}`);
      }

      return transformer(filter);
    });

    return Object.assign({}, ...filter);
  }

  /**
   * @protected
   * @param {Order} order
   * @returns {MongoSort}
   */
  _generateSort(order) {
    return {
      [order.orderBy === 'id' ? '_id' : order.orderBy]: order.isAsc() ? 1 : -1,
    };
  }
}

module.exports = {
  MongoCriteriaConverter,
};
