const { userUploadOptions } = require('#src/config/cloudinaryConfig');
const { BadRequestError, NotFoundError } = require('#src/util/errors');
const { verifyHashedData } = require('#src/util/hashData');
const { verifyExistingEmail } = require('#src/services/userService');
const {
  uploadImage,
  deleteLocalFile,
} = require('#src/services/cloudinaryService');
const User = require('#src/models/user/User');

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.validatedBody;
  const hasFile = !!req.file;

  try {
    let newImage = undefined;
    let newIdImage = undefined;

    const user = await User.findById(id);
    if (!user) throw new NotFoundError('usuario no encontrado');

    if (email && email !== user.email) {
      const emailExists = await verifyExistingEmail(email);
      if (emailExists)
        throw new BadRequestError('El email enviado ya esta registrado');
    }

    if (hasFile) {
      const { public_id, url } = await uploadImage(
        req.file,
        userUploadOptions,
        user.id_image,
      );
      newImage = url;
      newIdImage = public_id;
    }

    const newData = {
      ...req.validatedBody,
      image: newImage,
      id_image: newIdImage,
    };
    if (newData.password) delete newData.password;

    const updated = await User.findByIdAndUpdate(id, newData, { new: true });

    res.status(200).json({ updated, message: 'usuario actualizado' });
  } catch (err) {
    throw err;
  } finally {
    if (hasFile) await deleteLocalFile(req.file.filename);
  }
};

module.exports = {
  updateUser,
};
