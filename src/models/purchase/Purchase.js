const mongoose = require('mongoose');
const { type } = require('os');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Purchase = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new ObjectId().toString();
      },
    },
    _userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    transactionID: {
      type: Number,
      required: true,
      min: 100000000000,
      max: 999999999999,
    },
    purchaseData: {
      type: Schema.Types.Mixed,
      required: true,
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
    paymentData: {
      type: Schema.Types.Mixed || null,
      default: null,
    },
    expiration: {
      type: Date,
      default: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  },
);

module.exports = model('Purchase', Purchase);