const { OPEN_CAGE } = require('./envConfig');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'opencage',

  // Optional depending on the providers
  //fetch: customFetchImplementation,
  apiKey: OPEN_CAGE, // for Mapquest, OpenCage, APlace, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;