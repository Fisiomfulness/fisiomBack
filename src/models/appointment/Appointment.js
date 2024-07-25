const mongoose = require('mongoose');
const { type } = require('os');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Appointment = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    _professional: {
      type: ObjectId,
      ref: 'Profesional',
      required: true,
    },
    _patient: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      default: '',
      required: true,
    },
    additionalDescription: {
      type: String,
      default: '',
    },
    start: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // Check if the value has a time component
          const date = new Date(value);
          if (
            date.getHours() === 0 &&
            date.getMinutes() === 0 &&
            date.getSeconds() === 0 &&
            date.getMilliseconds() === 0
          ) {
            return false;
          }
          return true;
        },
        message: 'The appointment date must include a specific time.',
      },
    },
    end: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // Check if the value has a time component
          const date = new Date(value);
          if (
            date.getHours() === 0 &&
            date.getMinutes() === 0 &&
            date.getSeconds() === 0 &&
            date.getMilliseconds() === 0
          ) {
            return false;
          }
          return true;
        },
        message: 'The appointment date must include a specific time.',
      },
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'DEACTIVATE'],
      default: 'PENDING',
    },
    paymentInfo: {
      type: String,
      default: '',
    },
    expiration: {
      type: Date,
      default: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  },
);

module.exports = model('Appointment', Appointment);
