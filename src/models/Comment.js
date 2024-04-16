const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Comment = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: [1, 'must be at least 1, got {VALUE}'],
      max: [5, 'no more than 5 of rating, got {VALUE}'],
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    sender: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    blog: {
      type: ObjectId,
      ref: 'Blog',
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = model('Comment', Comment);
