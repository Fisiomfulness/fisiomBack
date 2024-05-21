const Profesional = require('../../models/Profesional');

const getProfessionals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = '',
      specialtyId = '',
      pos = '',
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
      return res
        .status(400)
        .json({ message: 'page and limit must be integers' });
    }
    const skipIndex = (pageInt - 1) * limitInt;

    const coords = pos.split(',');
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res
        .status(400)
        .json({ message: 'lat and lng must be valid coordinates' });
    }

    let professionalQuery = {
      $and: [
        {
          coordinates: {
            $near: [lat, lng],
          },
        },
        { status: true },
      ],
    };

    // if user is logged don't bring himself
    if (req.tokenUser) {
      professionalQuery.$and.push({ _id: { $ne: req.tokenUser.id } });
    }

    if (search.trim() !== '') {
      const searchArray = search.split(',');
      searchArray.forEach((s) => {
        s = s.trim();
        const ciudad = s.startsWith('ciudad:');
        const estado = s.startsWith('estado:');
        const pais = s.startsWith('pais:');

        if (ciudad) {
          professionalQuery.$and.push({
            'address.city': { $regex: new RegExp(s.replace('ciudad:', ''), 'i') },
          });
        } else if (estado) {
          professionalQuery.$and.push({
            'address.state': { $regex: new RegExp(s.replace('estado:', ''), 'i') },
          });
        } else if (pais) {
          professionalQuery.$and.push({
            'address.country': { $regex: new RegExp(s.replace('pais:', ''), 'i') },
          });
        } else {
          professionalQuery.$and.push({
            $or: [
              { name: { $regex: new RegExp(search, 'i') } },
              { 'address.streetName': { $regex: new RegExp(search, 'i') } },
              { 'address.city': { $regex: new RegExp(search, 'i') } },
              { 'address.state': { $regex: new RegExp(search, 'i') } },
              { 'address.country': { $regex: new RegExp(search, 'i') } },
            ],
          });
        }
      })
    }

    if (specialtyId !== '') {
      professionalQuery.$and.push({ specialties: { $in: [specialtyId] }});
    }

    const professionals = await Profesional.find(professionalQuery)
      .populate('specialties', 'name')
      .skip(skipIndex)
      .limit(limitInt);

    const queryWithoutNear = { ...professionalQuery };
    queryWithoutNear.$and.shift();

    const totalProfessionals =
      await Profesional.countDocuments(queryWithoutNear);
    const totalPages = Math.ceil(totalProfessionals / limitInt);
    return res.status(200).json({ quantity: totalProfessionals, professionals, page: pageInt, totalPages });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProfessionals,
};
