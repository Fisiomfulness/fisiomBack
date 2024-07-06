const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const ProfessionalRating = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    score: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    _professional: { type: ObjectId, ref: 'Profesional', required: true },
    _user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  }
);

module.exports = model('ProfessionalRating', ProfessionalRating);
