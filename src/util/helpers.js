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

const isDateOnRange = (value, minYearsAgo, maxYearsAgo) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!value || typeof value !== "string" || !isoDateRegex.test(value)) return false;

  const currentDate = new Date();
  const dateISO = new Date(value);

  const minDate = new Date(
    currentDate.getFullYear() - maxYearsAgo,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const maxDate = new Date(
    currentDate.getFullYear() - minYearsAgo,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  return dateISO >= minDate && dateISO <= maxDate;
};

module.exports = { validateId, countHtmlCharacters, isDateOnRange };
