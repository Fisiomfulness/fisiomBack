const Professional = require('../../models/profesional/Profesional');

const approveProfessional = async (req, res) => {
  try {
    const { professionalId } = req.params; // ID del profesional a aprobar

    // Buscar el profesional en la base de datos
    const professional = await Professional.findByPk(professionalId);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    // Aprobar al profesional
    professional.approved = true;
    await professional.save();

    return res
      .status(200)
      .json({ message: 'Profesional aprobado con éxito', professional });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { approveProfessional };
