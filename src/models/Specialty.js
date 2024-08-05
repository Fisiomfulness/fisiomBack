// @ts-check
const { Schema, model, Types } = require('mongoose');

const specialtySchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new Types.ObjectId().toString();
      },
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    professionals: {
      type: [{ type: Types.ObjectId, ref: 'Profesional' }],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
    collection: 'specialty',
  },
);

/**
 * @typedef
 *   {import('mongoose').InferSchemaType<typeof specialtySchema>}
 * InferSchemaTest
 */

/**
 * NOTE: `professionals` debe tiparse desde el modelo `Profesional` incluyendo
 * los campos `createdDate` y `updatedDate` como opcionales, lo mismo debe
 * hacerse con `professionalScore`
 *
 * @typedef {{
 *   _id: string,
 *   name: string,
 *   professionals: string[],
 *   keywords: string[],
 *   is_deleted: boolean,
 *   createdDate?: Date,
 *   updatedDate?: Date
 * }} ISpecialtyDocument
 *
 * @typedef {import('mongoose').Model<ISpecialtyDocument, {}, {}>} ISpecialtyModel
 *
 * @type {ReturnType<typeof model<ISpecialtyDocument, ISpecialtyModel>>}
 */
// @ts-ignore
const SpecialtyModel = model('Specialty', specialtySchema);

class Specialty {
  /**
   * @param {{
   *   id: string,
   *   name: string,
   *   keywords: string[],
   * }} values
   */
  constructor({ id, name, keywords }) {
    /** @readonly @type {string} */
    this.id = id;
    /** @readonly @type {string} */
    this.name = name;
    this.keywords = keywords;
  }
}

/**
 * @typedef {{
 *   count: number,
 *   results: Specialty[]
 * }} SpecialtyResponse
 */

module.exports = {
  SpecialtyModel,
  Specialty,
};
