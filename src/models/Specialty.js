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
      type: [
        {
          type: Types.ObjectId,
          ref: 'Profesional',
        },
      ],
      default: [],
    }
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
    collection: 'specialty',
  },
);

module.exports = model('Specialty', specialtySchema);
