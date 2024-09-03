const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Blog = new Schema(
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
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    id_image: {
      type: String,
      required: true,
    },
    avg_rating: {
      type: Number,
      max: 5,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: ObjectId,
      ref: 'Profesional',
      required: true,
    },
    type: {
      type: ObjectId,
      ref: 'Type',
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = model('Blog', Blog);
