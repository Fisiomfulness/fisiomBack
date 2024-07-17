const { NotFoundError } = require('./errors');
const mongoose = require('mongoose');

// * Returns a boolean value if document exist in db or not.
const validateId = async (id, modelName) => {
  return !!(await mongoose.model(modelName).findById(id));
};

// * For blog content htmlString validation
const countHtmlCharacters = (htmlString) => {
  // ? Tag <br> count like a character like Tiptap front library
  const text = htmlString.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '');
  return text.length;
};

const isDateOnRange = (value, minYearsAgo, maxYearsAgo) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!value || typeof value !== 'string' || !isoDateRegex.test(value)) return false;

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


// Function to generate random coordinates within 150 meters of the original location
function getRandomCoordinates(coordinates) {

  // Function to convert meters to degrees for latitude
  function metersToLatDegrees(meters) {
    return meters / 111320;
  }
  
  // Function to convert meters to degrees for longitude based on latitude
  function metersToLngDegrees(meters, latitude) {
    return meters / (111320 * Math.cos(latitude * (Math.PI / 180)));
  }
  
  const [lat, lng] = coordinates

  const radiusInMeters = 150;

  const latOffset = (Math.random() * 2 - 1) * metersToLatDegrees(radiusInMeters);
  const lngOffset = (Math.random() * 2 - 1) * metersToLngDegrees(radiusInMeters, lat);

  const newLat = lat + latOffset;
  const newLng = lng + lngOffset;

  return [newLat, newLng];
}

module.exports = {
  validateId,
  countHtmlCharacters,
  isDateOnRange,
  getRandomCoordinates
};
