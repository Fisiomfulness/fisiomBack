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
    text: {
      type: String,
      required: true,
    },
    title: {
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
    user_id: {
      type: String,
      // required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    type_id: {
      type: ObjectId,
      ref: 'Type',
    },
    createBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = model('Blog', Blog);
