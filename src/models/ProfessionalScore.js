const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const ProfessionalScore = new Schema({
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    _user: { type: ObjectId, ref: 'User' },
    _profesional: { type: ObjectId, ref: 'Profesional' },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
  }
);

module.exports = model('ProfessionalScore', ProfessionalScore);
