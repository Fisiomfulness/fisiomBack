const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const currentYear = new Date().getFullYear();

const experienceSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    startDateMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    startDateYear: {
      type: Number,
      required: true,
      min: currentYear - 100,
      max: currentYear,
    },
    endDateMonth: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
    },
    endDateYear: {
      type: Number,
      default: null,
      min: currentYear - 100,
      max: currentYear,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    current: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = experienceSchema;
