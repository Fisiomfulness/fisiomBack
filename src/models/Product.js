const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Product = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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
    stock: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 1
    }
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

module.exports = model('Product', Product);
