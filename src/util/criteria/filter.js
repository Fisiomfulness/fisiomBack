// @ts-check
const { InvalidArgumentError } = require('#src/util/errors');

/** @enum {"=" | "!=" | ">" | "<" | "CONTAINS" | "NOT_CONTAINS"} */
const FilterOperator = Object.freeze({
  EQUAL: '=',
  NOT_EQUAL: '!=',
  GT: '>',
  LT: '<',
  CONTAINS: 'CONTAINS',
  NOT_CONTAINS: 'NOT_CONTAINS',
  /**
   * @param {string} value
   * @returns {FilterOperator}
   */
  fromValue: function (value) {
    for (const orderType of Object.values(this)) {
      if (value === orderType) {
        return value;
      }
    }

    throw new InvalidArgumentError(`El operador de filtro '${value}' es invalido`);
  },
});

class Filter {
  /**
   * @param {string} field
   * @param {string} operator
   * @param {string} value
   */
  constructor(field, operator, value) {
    /** @readonly @type {string} */
    this.field = field;
    /** @readonly @type {string} */
    this.operator = operator;
    /** @readonly @type {string} */
    this.value = value;
  }

  /** @param {Filter} values */
  static fromValues(values) {
    const { field, operator, value } = values;

    if (!field || !operator || !value) {
      throw new InvalidArgumentError('El filtro es invalido');
    }

    return { field, operator, value };
  }
}

module.exports = {
  Filter,
  FilterOperator,
};
