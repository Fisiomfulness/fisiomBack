const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;
const dotenv = require('dotenv');
dotenv.config();

const { URL_PROFILE_DEFAULT } = process.env;

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
      required: true
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
      default: null
    },
    license: {
      type: String,
      default: null
    },
    stars: {
      type: Number,
      default: 0
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
    image: {
      type: String,
      default: URL_PROFILE_DEFAULT,
    },
    id_image: {
      type: String,
      default: 'does not have image id',
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = model('User', User);
