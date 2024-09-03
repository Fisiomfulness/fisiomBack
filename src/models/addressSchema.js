const { Schema } = require('mongoose');

const addressSchema = new Schema({
    streetName: { 
        type: String, 
        required: true 
    },
    streetNumber: { 
        type: String, 
        required: true 
    },
    floorAppartment: { 
        type: String, 
        required: false 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: false 
    },
    country: { 
        type: String, 
        required: true 
    },
}, { _id: false });

module.exports = addressSchema;