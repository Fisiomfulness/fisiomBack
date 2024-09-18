const { geocoder } = require('../config/geocoderConfig');

// * Si se va a utilizar validationMiddleware, usar este antes asi recibe el address completo en el body.
const addressMiddleware = async (req, res, next) => {
  try {
    const { streetName, streetNumber, city, state, country, floorAppartment } =
      req.body;

    if (!streetName || !streetNumber || !city || !country) {
      next();
      return;
    }

    const oneLineAddress = `${streetName} ${streetNumber}, ${city}, ${
      state ? state + ', ' : ''
    }${country}`;
    const result = await geocoder.geocode(oneLineAddress);
    const bestResult = result[0];

    if (
      bestResult &&
      bestResult.country &&
      // bestResult.state && // no suele venir para Perú
      bestResult.city &&
      bestResult.streetName &&
      // bestResult.streetNumber && // sin esto es menos exacto pero viene completo más veces, en especial para Lima, Peru
      bestResult.latitude &&
      bestResult.longitude
    ) {
      req.body.coordinates = [bestResult.latitude, bestResult.longitude];
    }

    req.body.address = {
      streetName,
      streetNumber,
      floorAppartment,
      city,
      state,
      country,
    };
  } catch (err) {
    console.log('error in geocoding middleware');
  }
  next();
};

module.exports = { addressMiddleware };
