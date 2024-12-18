const Professional = require('../../models/profesional/Profesional');
const { sendProfessionalNotification } = require('../mail');

const declineProfessional = async (req, res) => {
  try {
    const { professionalId } = req.params;

    const professional = await Professional.findById(professionalId);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    professional.isApproved = 'Rejected';
    await professional.save();


    await sendProfessionalNotification(professional.email, professional.name, professional.isApproved);

    return res
      .status(200)
      .json({ message: 'Profesional rechazado con éxito', professional });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { declineProfessional };
