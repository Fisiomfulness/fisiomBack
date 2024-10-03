const Professional = require('../../models/profesional/Profesional');

const getPendingProfessionals = async (req, res) => {
  try {
    const pendingProfessionals = await Professional.find({ isApproved: false });

    if (pendingProfessionals.length === 0) {
      return res
        .status(200)
        .json({ message: 'No hay profesionales pendientes de aprobación.' });
    }

    return res.status(200).json(pendingProfessionals);
  } catch (error) {
    console.error('Error al obtener profesionales pendientes:', error);
    return res
      .status(500)
      .json({ message: 'Error al obtener profesionales pendientes' });
  }
};

module.exports = { getPendingProfessionals };
