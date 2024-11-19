const User = require('../../models/user/User');
const Professional = require('../../models/profesional/Profesional');
const { NotFoundError, BadRequestError } = require('../../util/errors');
const { cloudinary, curriculumUploadOptions } = require('../../config/cloudinaryConfig');

const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const curriculum = req.file;

  try {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    if (user.role === role) {
      throw new BadRequestError(`El usuario ya tiene el rol de ${role}`);
    }

    if (role !== 'professional') {
      throw new BadRequestError('Rol no válido para esta operación');
    }

    // Subir el archivo a Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(
      curriculum.path,
      curriculumUploadOptions
    );

    // Crear un nuevo documento en el esquema de Professional
    const newProfessional = new Professional({
      _id: user._id,
      email: user.email,
      name: user.name,
      password: user.password,
      birthDate: user.birthDate,
      role: 'professional',
      gender: user.gender,
      curriculum: secure_url, // Usar la URL segura de Cloudinary
      phone: user.phone,
      address: user.address,
    });

    await newProfessional.save();

    res.status(200).json({ message: `Usuario cambiado a profesional`, professional: newProfessional });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { changeUserRole };
