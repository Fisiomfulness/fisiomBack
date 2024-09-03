const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const availabilitySchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  availability: [
    {
      day: { type: String, required: true },
      timeSlots: [{ start: String, end: String }],
    },
  ],
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
