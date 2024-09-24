const moment = require('moment');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;
const addressSchema = require('../addressSchema');

const User = new Schema(
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
      required: function () {
        return this.authProvider === 'local'; // Solo requerido si el proveedor es local
      },
    },
    birthDate: {
      type: String,
      default: '',
      required: function () {
        return this.authProvider === 'local'; // Solo requerido si el proveedor es local
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
    },
    interests: {
      type: [
        {
          type: ObjectId,
          ref: 'Interest',
        },
      ],
      default: [],
    },
    gender: {
      type: String,
      enum: ['Femenino', 'Masculino', 'Prefiero no responder'],
      required: function () {
        return this.authProvider === 'local'; // Solo requerido si el proveedor es local
      },
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
    },
    coordinates: {
      type: [Number], // lat, lng
      default: [0, 0],
      index: '2d',
    },
    address: {
      type: addressSchema,
      required: function () {
        return this.authProvider === 'local'; // Solo requerido si el proveedor es local
      },
      default: {},
    },
    image: {
      type: String,
      default: '',
    },
    id_image: {
      type: String,
      default: '',
    },
    // Aquí se agrega el campo authProvider
    authProvider: {
      type: String,
      enum: ['local', 'google'], // Puede ser 'local' o 'google'
      default: 'local', // Valor por defecto
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } },
);

User.virtual('age').get(function () {
  if (!this.birthDate) return null; // Return null if birthDate is not set
  const today = moment();
  const birthDate = moment(this.birthDate);

  // Calculate the age using Moment.js
  const age = today.diff(birthDate, 'years');

  return age;
});

User.set('toObject', { virtuals: true });
User.set('toJSON', { virtuals: true });

module.exports = model('User', User);
