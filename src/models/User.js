const mongoose = require('mongoose');
const { DEFAULT_USER_IMAGE } = require('../config/envConfig');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const User = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
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
    status: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'profesional'],
      default: 'user',
    },
    curriculum: {
      type: String,
      default: null,
    },
    license: {
      type: String,
      default: null,
    },
    stars: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: '',
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
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
    birthDate: {
      type: String,
      default: '',
      required: true,
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

module.exports = model('User', User);
