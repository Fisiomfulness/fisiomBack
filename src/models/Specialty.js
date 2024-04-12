const { Schema, model, Types } = require('mongoose');
// const { Schema, model } = mongoose;

const specialtySchema = new Schema(
  {
    _id: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
      // auto: true,
      default: function () {
        return new Types.ObjectId().toString();
      },
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
    collection: 'specialty',
  },
);

module.exports = model('Specialty', specialtySchema);
