const Profesional = require('#src/models/profesional/Profesional');
const Specialty = require('#src/models/profesional/Specialty');
const { getRandomCoordinates } = require('#src/util/helpers');
const roles = require('../../util/roles');
const Fuse = require('fuse.js');

const LIMIT_PROFESSIONALS = 6;

const getProfessionals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = LIMIT_PROFESSIONALS,
      search = '',
      specialtyId = '',
      city = '',
      position = '0,0',
      bbox = '',
    } = req.query;
	
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Validate page and limit
    if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
      return res
        .status(400)
        .json({ message: 'page and limit must be integers' });
    }

    const queryLimit =
      limitInt <= 0
        ? LIMIT_PROFESSIONALS
        : Math.min(limitInt, LIMIT_PROFESSIONALS);
    const skipIndex = (pageInt - 1) * queryLimit;

    // Validate user position
    const coords = position.split(',');
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res
        .status(400)
        .json({ message: 'lat and lng must be valid coordinates' });
    }

    // Start professional query, don't bring deleted professionals
    let professionalQuery = {
      $and: [{ status: true }],
    };

    // If user is logged don't bring himself
    if (req.user) {
      professionalQuery.$and.push({ _id: { $ne: req.user.id } });
    }

    // If city match city
    if (city.trim() !== '') {
      professionalQuery.$and.push({ 'address.city': city });
    }

    // If specialtyId
    if (specialtyId !== '') {
      professionalQuery.$and.push({ specialties: { $in: [specialtyId] } });
    }

    // If search query
    if (search.trim() !== '') {
      const searchArray = decodeURIComponent(search)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      // Get all professionals in query so far and populate spelcialties

      const professionals = await Profesional.find(professionalQuery).populate(
        'specialties',
        'name keywords'
      );
      console.log('profesional buscaro', professionals, professionalQuery);
      // Set up Fuse for fuzzy search on professionals and specialties
      const fuseOptions = {
        includeScore: true,
        threshold: 0.2,
        keys: [
          'name',
          'address.streetName',
          'address.city',
          'address.state',
          'address.country',
          'specialties.name',
          'specialties.keywords',
          'services.serviceDescription',
          // add any more fields
        ],
      };
      const fuseProfessionals = new Fuse(professionals, fuseOptions);

      // Create an array to hold fuse result IDs for each search term
      const fuseResultIDs = searchArray.map((term) =>
        fuseProfessionals
          .search(term)
          .map((result) => result?.item._id.toString())
      );

      // Filter unique professional IDs present in every fuse result
      const matchedProfessionalIds = fuseResultIDs[0].filter((id) =>
        fuseResultIDs.every((ids) => ids.includes(id))
      );

      // Add matched professional IDs to the query
      professionalQuery.$and.push({ _id: { $in: matchedProfessionalIds } });
    }

    // Prepare polygonQuery if bbox
    let polygonQuery;
    if (bbox !== '') {
      const bboxArray = bbox.split(',').map(parseFloat);
      const southwest = [bboxArray[1], bboxArray[0]];
      const northeast = [bboxArray[3], bboxArray[2]];
      const box = [southwest, northeast];
      polygonQuery = { box };
    }

    if (polygonQuery) {
      // Get professionals in polygon
      const professionals = await Profesional.find(professionalQuery)
        .populate('specialties', 'name')
        .where('coordinates')
        .within(polygonQuery)
        .sort({ 'rating.average': -1 })
        .limit(queryLimit);

      // Hide address in response unless admin request
      if (
        !req.user ||
        (req.user.role !== roles.ADMIN && req.user.role !== roles.SUPER_ADMIN)
      ) {
        professionals.forEach((professional) => {
          professional.address.streetName = 'hidden';
          professional.address.streetNumber = 'hidden';
          professional.address.floorAppartment = 'hidden';
          professional.coordinates = getRandomCoordinates(
            professional.coordinates
          );
        });
      }

      return res.status(200).json({
        quantity: professionals.length,
        professionals,
        page: 1,
        totalPages: 1,
      });
    } else {
      // Get professionals sorted by proximity
      const professionals = await Profesional.find(professionalQuery)
        .populate('specialties', 'name')
        .where('coordinates')
        .near([lat, lng])
        .skip(skipIndex)
        .limit(queryLimit);

      // Hide address in response unless admin request
      if (
        !req.user ||
        (req.user.role !== roles.ADMIN && req.user.role !== roles.SUPER_ADMIN)
      ) {
        professionals.forEach((professional) => {
          professional.address.streetName = 'hidden';
          professional.address.streetNumber = 'hidden';
          professional.address.floorAppartment = 'hidden';
          professional.coordinates = getRandomCoordinates(
            professional.coordinates
          );
        });
      }

      const totalProfessionals = await Profesional.countDocuments(
        professionalQuery
      );
      const totalPages = Math.ceil(totalProfessionals / queryLimit);

      return res.status(200).json({
        quantity: totalProfessionals,
        professionals,
        page: pageInt,
        totalPages,
      });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProfessionals,
};
