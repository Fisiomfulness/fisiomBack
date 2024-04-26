// @ts-check
const { InvalidArgumentError } = require('#src/util/errors');

/**
 * @typedef {{
 *   field: string,
 *   operator: string,
 *   value: string,
 * }} Filter
 */

/**
 * @param {any[]} filters
 * @returns {Filter[]}
 */
const filtersFromValues = (filters) => {
  return filters.map((filter) => {
    const { field, operator, value } = filter;

    if (!field || !operator || !value) {
      throw new InvalidArgumentError('El filtro es invalido');
    }

    return { field, operator, value };
  });
};

module.exports = {
  filtersFromValues,
};
