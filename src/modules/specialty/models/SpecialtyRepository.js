// @ts-check

/**
 * @typedef {import("#src/util/criteria/criteria").Criteria} Criteria
 * @typedef {import("#src/models/Specialty").Specialty} Specialty
 */

/** @interface */
class SpecialtyRepository {
  /**
   * NOTE: `save` verifica si el dato ya existe, de ser asi lo actualiza, de lo
   * contrario lo crea. Quizas mas adelante se use `save` en lugar de los
   * metodos `update` y `create`
   *
   * save(_specialty) {
   *   throw new Error('Not implemented');
   * }
   */

  /**
   * @param {string} _value
   * @returns {Promise<Specialty>}
   */
  create(_value) {
    throw new Error('Not implemented');
  }

  /**
   * @param {Specialty} _specialty
   * @returns {Promise<Specialty>}
   */
  update(_specialty) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} _id
   * @returns {Promise<Specialty>}
   */
  delete(_id) {
    throw new Error('Not implemented');
  }

  /**
   * @param {Criteria} _criteria
   * @returns {Promise<{
   *   count: number,
   *   results: Specialty[],
   * }>}
   */
  matching(_criteria) {
    throw new Error('Not implemented');
  }
}

module.exports = { SpecialtyRepository };
