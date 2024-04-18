const mongoose = require('mongoose');
const { DEFAULT_USER_IMAGE } = require('../config/envConfig');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Profesional = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      default: '',
      required: true,
    },
    role: {
      type: String,
      default: 'profesional',
    },
    gender: {
      type: String,
      Enum: ['Femenino', 'Masculino', 'Prefiero no responder'],
      required: true,
    },
    curriculum: {
      type: String,
      default: null,
      required: true,
    },
    license: {
      type: String,
      default: null,
    },
    profesionalScore: [
      {
        type: ObjectId,
        ref: 'ProfesionalScore',
      },
    ],
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
      required: true,
    },
    experience: {
      type: Array,
      default: [],
    },
    latitud: {
      type: Number,
      default: 0,
    },
    longitud: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: DEFAULT_USER_IMAGE,
    },
    id_image: {
      type: String,
      default: 'does not have image id',
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } },
);

Profesional.virtual('stars').get(function () {
  if (this.profesionalScore && this.profesionalScore.length > 0) {
    const totalScore = this.profesionalScore.reduce((acc, score) => acc + score.score, 0);
    return totalScore / this.profesionalScore.length;
  } else {
    return 0;
  }
});

module.exports = model('Profesional', Profesional);

