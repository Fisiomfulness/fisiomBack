const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

// ? Pregunta a un experto
const Question = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    text: {
      type: String,
      required: true,
    },
    answer: {
      text: String,
      professional: {
        type: ObjectId,
        ref: 'Profesional',
      },
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    specialty: {
      // ? Could have one specific specialty or be a general question (null)
      type: ObjectId,
      ref: 'Specialty',
      default: null,
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = model('Question', Question);
