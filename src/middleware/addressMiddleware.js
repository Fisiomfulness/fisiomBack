const { geocoder } = require('../config/geocoderConfig');

const addressMiddleware = async (req, res, next) => {
    try {
        const { streetName, streetNumber, city, state, country, floorAppartment } = req.body
        if (!streetName || !streetNumber || !city || !country) {
            next()
            return;
        }

        const oneLineAddress = `${streetName} ${streetNumber}, ${city}, ${state ? state + ", " : null}${country}`
        const result = await geocoder.geocode(oneLineAddress)
        const bestResult = result[0]

        if (bestResult 
        && bestResult.country 
        && bestResult.state 
        && bestResult.city 
        && bestResult.streetName 
        && bestResult.streetNumber
        && bestResult.latitude
        && bestResult.longitude) {
            req.body.coordinates = [bestResult.latitude, bestResult.longitude]
        }
        
        req.body.address = {
            streetName,
            streetNumber,
            floorAppartment,
            city,
            state,
            country
        }

    } catch (err) {
    console.log('error in geocoding middleware')
    }
  next()
}

module.exports = { addressMiddleware };