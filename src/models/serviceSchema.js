const { Schema } = require('mongoose');

const serviceSchema = new Schema({
    serviceDescription: { 
        type: String, 
        required: true 
    },
    serviceCost: {
        type: Number, 
        required: true
    },
}, { _id: false });

module.exports = serviceSchema;