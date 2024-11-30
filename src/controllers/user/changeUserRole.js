const User = require('../../models/user/User');
const Professional = require('../../models/profesional/Profesional');
const { NotFoundError, BadRequestError } = require('../../util/errors');
const { cloudinary, curriculumUploadOptions } = require('../../config/cloudinaryConfig');

const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role, curriculum } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    if (user.role === role) {
      throw new BadRequestError(`El usuario ya tiene el rol de ${role}`);
    }

    if (role !== 'professional') {
      throw new BadRequestError('Rol no válido para esta operación');
    }

    const secure_url = curriculum;

    // Verificar si el profesional ya existe
    let professional = await Professional.findById(id);
    if (professional) {
      // Actualizar el documento existente
      professional.curriculum = secure_url;
      professional.isApproved = 'Pending';
      await professional.save();
    } else {
      // Crear un nuevo documento en el esquema de Professional
      professional = new Professional({
        _id: user._id,
        email: user.email,
        name: user.name,
        password: user.password,
        birthDate: user.birthDate,
        role: 'professional',
        gender: user.gender,
        curriculum: secure_url,
        phone: user.phone,
        address: user.address,
        isApproved: 'Pending',
      });

      await professional.save();
    }

    res.status(200).json({ message: `Usuario cambiado a profesional`, professional });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { changeUserRole };
