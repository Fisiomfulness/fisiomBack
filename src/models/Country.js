const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const countryCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
});

module.exports = mongoose.model('CountryCode', countryCodeSchema);
