const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const category = new Schema({
  _id: {
    type: String,
    default: function () {
      return new ObjectId().toString();
    },
  },
  name:{
    type:String,
    required:true
  }
},{ timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });



module.exports = model("Category", category);