const mongoose = require('mongoose');
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
      default: 'professional',
    },
    gender: {
      type: String,
      Enum: ['Femenino', 'Masculino', 'Prefiero no responder'],
      required: true,
    },
    city: {
      type: String,
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
    professionalScore: [
      {
        type: ObjectId,
        ref: 'ProfessionalScore',
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
      type: [Number], // lat, lng
      default: [0, 0],
      index: '2d',
    },
    image: {
      type: String,
      default: ''
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
        },
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  }
);

module.exports = model('Profesional', Profesional);
