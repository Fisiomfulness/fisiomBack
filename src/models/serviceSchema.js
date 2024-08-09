const { Schema } = require('mongoose');

const serviceSchema = new Schema({
    serviceTitle: {
        type: String,
        required: true,
    },
    serviceDescription: { 
        type: String, 
        required: true 
    },
    serviceCost: {
        type: Number, 
        required: true
    },
    serviceDuration: {
        // * (Minutos) No utilizado en el front pero en un futuro puede llegar a ser util
        type: Number,
        default: 60,
      },
}, { _id: false });

module.exports = serviceSchema;