const { Schema } = require('mongoose');

const addressSchema = new Schema(
  {
    streetName: {
      type: String,
      required: false,
    },
    streetNumber: {
      type: String,
      required: false,
    },
    floorAppartment: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
  },
  { _id: false },
);

module.exports = addressSchema;
