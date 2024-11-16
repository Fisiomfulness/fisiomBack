const Professional = require('../../models/profesional/Profesional');
const User = require('../../models/user/User');

const rejectProfessional = async (req, res) => {
  try {
    const { professionalId } = req.params;

    // Buscar al profesional en el esquema de Professional
    const professional = await Professional.findById(professionalId);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    // Eliminar al profesional del esquema de Professional
    await Professional.findByIdAndDelete(professionalId);

    // Asegurarse de que el usuario sigue existiendo en el esquema de User
    const user = await User.findById(professionalId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado en el esquema de User' });
    }

    return res.status(200).json({ message: 'Solicitud de profesional rechazada. El usuario conserva su rol de usuario.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { rejectProfessional };
