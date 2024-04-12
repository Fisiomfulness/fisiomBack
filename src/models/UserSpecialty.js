const { Schema, model } = require('mongoose');

const userSpecialtySchema = new Schema(
  {
    user_id: {
      // type: Schema.Types.ObjectId,
      type: String,
      required: true,
      // ref: "User",
    },
    specialty_id: {
      // type: Schema.Types.ObjectId,
      type: String,
      required: true,
      // ref: "Specialty",
    },
  },
  {
    collection: 'user_specialty',
    _id: false,
  },
);

module.exports = model('UserSpecialty', userSpecialtySchema);
