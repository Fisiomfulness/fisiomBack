// @ts-check
const { SpecialtyModel, Specialty } =
  require('#src/models/profesional/Specialty');
const { MongoCriteriaConverter } = require('./MongoCriteriaConverter');

/**
 * @typedef {import("#src/util/criteria/criteria").Criteria} Criteria
 * @typedef {import("../models/SpecialtyRepository").SpecialtyRepository} SpecialtyRepository
 */

/** @implements {SpecialtyRepository} */
class MongoSpecialtyRepository {
  criteriaConverter = new MongoCriteriaConverter();
  collection = SpecialtyModel;

  /**
   * @param {Specialty} value
   * @returns {Promise<Specialty>}
   */
  async create(value) {
    const response = await this.collection.create(value);

    return new Specialty({
      id: response._id,
      name: response.name,
      keywords: response.keywords
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<Specialty>}
   */
  async delete(id) {
    const response = await this.collection.findByIdAndUpdate(id, {
      is_deleted: true,
    });

    if (!response) {
      throw new Error('Specialty not found');
    }

    return new Specialty({
      id: response._id,
      name: response.name,
      keywords: response.keywords
    });
  }

  /**
   * @param {Specialty} specialty
   * @returns {Promise<Specialty>}
   */
  async update(specialty) {
    const { id, ...specialtyProps } = specialty;
    const response = await this.collection.findByIdAndUpdate(id, specialtyProps, { new: true });

    if (!response) {
      throw new Error('Specialty not found');
    }

    return new Specialty({
      id: response._id,
      name: response.name,
      keywords: response.keywords
    });
  }

  /**
   * @param {Criteria} criteria
   * @returns {Promise<{
   *   count: number,
   *   results: Specialty[],
   * }>}
   */
  async matching(criteria) {
    const query = this.criteriaConverter.convert(criteria);

    const count = await this.collection.countDocuments({
      ...query.filter,
      is_deleted: false,
    });

    const results = await this.collection
      .find({ ...query.filter, is_deleted: false }, {})
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit);

    const specialtyResults = results.map((result) => ({
      id: result._id,
      name: result.name,
      keywords: result.keywords,
      createdDate: result.createdDate,
      updatedDate: result.updatedDate,
    }));

    return {
      count,
      results: specialtyResults,
    };
  }
}

module.exports = { MongoSpecialtyRepository };
