const Profesional = require('../../models/profesional/Profesional');
const roles = require('../../util/roles');
const { getRandomCoordinates } = require('../../util/helpers');

const getProfessionalDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const professional = await Profesional.findById(id).populate(
      'specialties',
      'name'
    );

    if (!professional)
      return res.status(200).json({ message: 'Profesional no encontrado' });

    if (
      !req.user ||
      (req.user.role !== roles.ADMIN && req.user.role !== roles.SUPER_ADMIN)
    ) {
      professional.address.streetName = 'hidden';
      professional.address.streetNumber = 'hidden';
      professional.address.floorAppartment = 'hidden';
      professional.coordinates = getRandomCoordinates(professional.coordinates);
    }

    return res.status(200).json({ professional });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProfessionalDetail,
};
