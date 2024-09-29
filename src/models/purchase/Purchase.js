const mongoose = require('mongoose');
const { type } = require('os');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Purchase = new Schema(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toString(),
    },
    _userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    purchaseNumber: {
      type: Number,
      required: true,
      min: 100000000000,
      max: 999999999999,
    },
    amount: {
        type: Number,
        required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    sessionKey: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    expiration: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  },
);

module.exports = model('Purchase', Purchase);