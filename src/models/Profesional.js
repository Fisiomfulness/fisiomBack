const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;
const addressSchema = require('./addressSchema');
const timeLapseSchema = require('./timeLapseSchema');
const moment = require('moment');
const experienceSchema = require('./experienceSchema');

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
    curriculum: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      default: '',
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
    description: {
      type: String,
      default: '',
    },
    address: {
      type: addressSchema,
      required: true,
    },
    coordinates: {
      type: [Number], // lat, lng
      default: [0, 0],
      index: '2d',
    },
    image: {
      type: String,
      default: '',
    },
    id_image: {
      type: String,
      default: '',
    },
    availability: {
      monday: { type: [timeLapseSchema], default: [] },
      tuesday: { type: [timeLapseSchema], default: [] },
      wednesday: { type: [timeLapseSchema], default: [] },
      thursday: { type: [timeLapseSchema], default: [] },
      friday: { type: [timeLapseSchema], default: [] },
      saturday: { type: [timeLapseSchema], default: [] },
      sunday: { type: [timeLapseSchema], default: [] },
    },
    consultationPrice: {
      type: Number,
      default: 0,
    },
    experience: {
      type: [experienceSchema],
      default: [],
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
  },
);

module.exports = model('Profesional', Profesional);
