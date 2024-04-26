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
    resume: {
      type: String,
      default: "",
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
    professionalScore: [
      {
        type: ObjectId,
        ref: 'ProfessionalScore',
      },
    ],
    averageScore: {
      average: { type: Number, default: 0 },
      totalComments: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
    },
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
    address: {
      type: String,
      default: '',
    },
    coordinates: {
      type: [Number], // long, lat
      default: [0, 0],
      index: '2d'
    },
    image: {
      type: String,
      default: DEFAULT_USER_IMAGE,
    },
    id_image: {
      type: String,
      default: 'does not have image id',
    },
    consultationPrice: {
      type: Number,
      default: 0,
    },
    specialties: {
      type: [
        {
          type: ObjectId, 
          ref: 'Specialty',
        }
      ],
      default: [],
    },
  },
  { 
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  },
);


module.exports = model('Profesional', Profesional);

