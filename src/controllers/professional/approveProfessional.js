const Professional = require('../../models/profesional/Profesional');
const User = require('../../models/user/User');

const approveProfessional = async (req, res) => {
  try {
    const { professionalId } = req.params;

    const professional = await Professional.findById(professionalId);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    professional.isApproved = true;
    await professional.save();

    await User.findByIdAndDelete(professionalId);

    return res
      .status(200)
      .json({ message: 'Profesional aprobado con éxito', professional });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { approveProfessional };
