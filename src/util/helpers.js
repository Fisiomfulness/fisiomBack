const { NotFoundError } = require('./errors');
const mongoose = require('mongoose');

// * Returns a boolean value if document exist in db or not.
const validateId = async (id, modelName) => {
  return !!(await mongoose.model(modelName).findById(id));
};

module.exports = { validateId };
