const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

const timeLapseSchema = new Schema(
  {
    start: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return moment(value, 'HH:mm').isValid();
        },
        message: (props) => {
          return `${props.value} no es una hora válida. Por favor usa HH:mm (24 horas)`;
        },
      },
    },
    end: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return moment(value, 'HH:mm').isValid();
        },
        message: (props) => {
          return `${props.value} no es una hora válida. Por favor usa HH:mm (24 horas)`;
        },
      },
    },
  },
  { _id: false },
);

// Schema-level validation
timeLapseSchema.pre('validate', function (next) {
  if (
    this.start &&
    this.end &&
    moment(this.end, 'HH:mm').isBefore(moment(this.start, 'HH:mm'))
  ) {
    this.invalidate(
      'end',
      `${this.end} debe ser mayor que la hora de inicio ${this.start}`,
    );
  }
  next();
});

module.exports = timeLapseSchema;
