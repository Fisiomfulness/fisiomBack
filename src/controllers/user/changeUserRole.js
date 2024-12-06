const User = require('../../models/user/User');
const Professional = require('../../models/profesional/Profesional');
const { NotFoundError, BadRequestError } = require('../../util/errors');
const { cloudinary, curriculumUploadOptions } = require('../../config/cloudinaryConfig');

const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  console.log(`Iniciando cambio de rol para el usuario con ID: ${id}`);

  try {
    const user = await User.findById(id);
    if (!user) {
      console.error('Usuario no encontrado');
      throw new NotFoundError('Usuario no encontrado');
    }

    console.log(`Usuario encontrado: ${user.email}`);

    if (user.role === role) {
      console.error(`El usuario ya tiene el rol de ${role}`);
      throw new BadRequestError(`El usuario ya tiene el rol de ${role}`);
    }

    if (role !== 'professional') {
      console.error('Rol no válido para esta operación');
      throw new BadRequestError('Rol no válido para esta operación');
    }

    if (!req.file) {
      console.error('No se adjuntó un curriculum');
      return res.status(400).json({ message: 'No se adjuntó un curriculum' });
    }

    console.log('Subiendo archivo a Cloudinary...');
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, curriculumUploadOptions);
    console.log(`Archivo subido a Cloudinary: ${secure_url}`);

    let professional = await Professional.findById(id);
    if (professional) {
      console.log('Actualizando documento existente de profesional');
      professional.curriculum = secure_url;
      professional.isApproved = 'Pending';
      professional.coordinates = user.coordinates;
      await professional.save();
    } else {
      console.log('Creando nuevo documento en el esquema de Professional');
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
        coordinates: user.coordinates,
        isApproved: 'Pending',
      });

      await professional.save();
    }

    console.log('Cambio de rol a profesional completado');
    res.status(200).json({ message: `Usuario cambiado a profesional`, professional });
  } catch (error) {
    console.error(`Error al cambiar el rol: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { changeUserRole };
