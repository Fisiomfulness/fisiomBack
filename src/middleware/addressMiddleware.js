const geocoder = require('../config/geocoderConfig');

const addressMiddleware = async (req, res, next) => {
  try {
    // Construir el objeto de dirección a partir de los campos individuales
    req.body.address = {
      streetName: req.body.streetName,
      streetNumber: req.body.streetNumber,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    };

    const { city, state, country } = req.body.address;

    if (!city || !state || !country) {
      return res.status(400).json({ message: 'La dirección es requerida' });
    }

    // Construir la dirección completa
    const fullAddress = `${city}, ${state}, ${country}`;

    // Obtener las coordenadas usando el geocoder
    const [result] = await geocoder.geocode(fullAddress);

    if (result) {
      // Asignar coordenadas aproximadas al usuario
      req.body.coordinates = [result.latitude, result.longitude];
    } else {
      // Si no se encuentran coordenadas, asignar valores por defecto
      req.body.coordinates = [0, 0];
    }

    next();
  } catch (error) {
    console.error('Error al geocodificar la dirección:', error);
    res.status(500).json({ message: 'Error al procesar la dirección' });
  }
};

module.exports = { addressMiddleware };
