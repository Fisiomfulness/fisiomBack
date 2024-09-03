const { Schema, model } = require('mongoose');

const userSpecialtySchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      ref: 'User',
    },
    specialty_id: {
      type: String,
      required: true,
      ref: 'Specialty',
    },
  },
  {
    collection: 'user_specialty',
  },
);

module.exports = model('UserSpecialty', userSpecialtySchema);
