const mongoose = require('mongoose');
const { type } = require('os');
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Transaction = new Schema(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toString(),
    },
    _userId: {
      type: String,
      default: "Guest",
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
    currency: {
        type: String,
        required: true
    },
    authorizedAmount: { 
        type: Number,
        required: true 
        },
    authorizationCode: { 
        type: String,
        required: true 
        },
    actionCode: { 
        type: String,
        required: true 
        },
    traceNumber: { 
        type: String,
        required: true 
        },
    transactionDate: { 
        type: String,
        required: true 
        },
    transactionId: { 
        type: String,
        required: true 
        },
    cardType: { 
        type: String
    }, // From dataMap (CARD_TYPE)
    eci_description: { 
        type: String
    }, // From dataMap (ECI_DESCRIPTION)
    status: 
        { type: String,
        required: true 
    }, // From dataMap (STATUS)
    actionDescription: { 
        type: String, 
        required: true
    }, // From dataMap (ACTION_DESCRIPTION)
    brand: { 
        type: String,
        required: true 
    }, // From dataMap (BRAND)

  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  },
);

module.exports = model('Transaction', Transaction);