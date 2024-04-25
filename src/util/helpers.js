const { NotFoundError } = require('./errors');
const mongoose = require('mongoose');

// * Returns a boolean value if document exist in db or not.
const validateId = async (id, modelName) => {
  return !!(await mongoose.model(modelName).findById(id));
};

// * For blog content htmlString validation
const countHtmlCharacters = (htmlString) => {
  // ? Tag <br> count like a character like tiptap
  const text = htmlString.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '');
  return text.length;
}

module.exports = { validateId, countHtmlCharacters };
