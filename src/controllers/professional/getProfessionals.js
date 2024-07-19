const Profesional = require('../../models/Profesional');
const { getRandomCoordinates } = require('#src/util/helpers');
const roles = require('../../util/roles');

const getProfessionals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = '',
      specialtyId = '',
      city = '',
      position = '0,0',
      bbox = '',
    } = req.query;
    
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
      return res
        .status(400)
        .json({ message: 'page and limit must be integers' });
    }
    const skipIndex = (pageInt - 1) * limitInt;

    const coords = position.split(',');
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res
        .status(400)
        .json({ message: 'lat and lng must be valid coordinates' });
    }

    let polygonQuery;
    if (bbox !== '') {
      const bboxArray = bbox.split(',').map(parseFloat);
      const southwest = [bboxArray[1], bboxArray[0]];
      const northeast = [bboxArray[3], bboxArray[2]];
      const box = [southwest, northeast];
      polygonQuery = { box };
    }

    let professionalQuery = {
      $and: [
        { status: true },
      ],
    };

    // If user is logged don't bring himself
    if (req.user) {
      professionalQuery.$and.push({ _id: { $ne: req.user.id } });
    }

    if (city.trim() !== '') {
      professionalQuery.$and.push({ 'address.city': city });
    }
    
    if (search.trim() !== '') {
      const searchArray = search.split(',');
      searchArray.forEach((s) => {
        s = s.trim();
        professionalQuery.$and.push({
          $or: [
            { name: { $regex: new RegExp(s, 'i') } },
            { 'address.streetName': { $regex: new RegExp(s, 'i') } },
            { 'address.city': { $regex: new RegExp(s, 'i') } },
            { 'address.state': { $regex: new RegExp(s, 'i') } },
            { 'address.country': { $regex: new RegExp(s, 'i') } },
          ],
        });
      })
    }

    if (specialtyId !== '') {
      professionalQuery.$and.push({ specialties: { $in: [specialtyId] }});
    }

    if (polygonQuery) {
      const professionals = await Profesional.find(professionalQuery)
      .populate('specialties', 'name')
      .where('coordinates').within(polygonQuery)
      .sort({'rating.average': -1})
      .limit(limitInt);

      // hide address in response unless admin request
      if (!req.user
        || (
          req.user.role !== roles.ADMIN
          && req.user.role !== roles.SUPER_ADMIN
        )
      ) {
        professionals.forEach((professional) => {
          professional.address.streetName = "hidden";
          professional.address.streetNumber = "hidden";
          professional.address.floorAppartment = "hidden";
          professional.coordinates = getRandomCoordinates(professional.coordinates);
        })
      }

      return res.status(200).json({ quantity: professionals.length, professionals, page: 1, totalPages: 1 });

    } else {
      const professionals = await Profesional.find(professionalQuery)
      .populate('specialties', 'name')
      .where('coordinates').near([lat, lng])
      .skip(skipIndex)
      .limit(limitInt);

      // hide address in response unless admin request
      if (!req.user
        || (
          req.user.role !== roles.ADMIN
          && req.user.role !== roles.SUPER_ADMIN
        )
      ) {
        professionals.forEach((professional) => {
          professional.address.streetName = "hidden";
          professional.address.streetNumber = "hidden";
          professional.address.floorAppartment = "hidden";
          professional.coordinates = getRandomCoordinates(professional.coordinates);
        })
      }
  
      const totalProfessionals =
        await Profesional.countDocuments(professionalQuery);
      const totalPages = Math.ceil(totalProfessionals / limitInt);

      return res.status(200).json({ quantity: totalProfessionals, professionals, page: pageInt, totalPages });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProfessionals,
};
