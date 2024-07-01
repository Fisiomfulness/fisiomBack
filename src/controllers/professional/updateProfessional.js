const { userUploadOptions } = require('#src/config/cloudinaryConfig');
const { BadRequestError, NotFoundError } = require('#src/util/errors');
const { verifyHashedData } = require('#src/util/hashData');
const { verifyExistingEmail } = require('#src/services/userService');
const {
  uploadImage,
  deleteLocalFile,
} = require('#src/services/cloudinaryService');
const Professional = require('#src/models/Profesional');

const updateProfessional = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.validatedBody;
  const hasFile = !!req.file;

  try {
    let newImage = undefined;
    let newIdImage = undefined;

    const professional = await Professional.findById(id);
    if (!professional) throw new NotFoundError('profesional no encontrado');

    if (email && email !== professional.email) {
      const emailExists = await verifyExistingEmail(email);
      if (emailExists) throw new BadRequestError('El email enviado ya esta registrado');
    }

    if (hasFile) {
      const { public_id, url } = await uploadImage(req.file, userUploadOptions, professional.id_image);
      newImage = url;
      newIdImage = public_id;
    }

    const newData = {
      ...req.validatedBody,
      image: newImage,
      id_image: newIdImage,
    };
    if (newData.password) delete newData.password;

    const updated = await Professional.findByIdAndUpdate(id, newData, { new: true });

    res.status(200).json({ updated, message: 'profesional actualizado' });
  } catch (err) {
    throw err;
  } finally {
    if (hasFile) await deleteLocalFile(req.file.filename);
  }
};

module.exports = {
  updateProfessional,
};
