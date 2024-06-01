const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require('#src/util/errors');
const { verifyHashedData } = require('#src/util/hashData');
const { verifyExistingEmail } = require('#src/util/helpers');
const {
  cloudinary,
  userUploadOptions,
} = require('../../config/cloudinaryConfig');
const fs = require('node:fs/promises');
const User = require('../../models/User');
const Profesional = require('../../models/Profesional');

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const hasFile = !!req.file;

  try {
    let newImage = undefined;
    let newIdImage = undefined;

    const [user, professional] = await Promise.all([
      User.findById(id),
      Profesional.findById(id),
    ]);
    const foundUser = user || professional;
    if (!foundUser) throw new NotFoundError('usuario no encontrado');

    if (email) {
      const emailExists = await verifyExistingEmail(email);
      if (!emailExists) {
        throw new BadRequestError('Email enviado ya existe...');
      }
    }
    
    const isCorrectPassword = await verifyHashedData(req.body.password, foundUser.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedError('La contraseña que has introducido es incorrecta');
    }

    if (hasFile) {
      const newImageUrl = req.file.path;

      if (foundUser.id_image)
        await cloudinary.uploader.destroy(foundUser.id_image);
      const { public_id, url } = await cloudinary.uploader.upload(
        newImageUrl,
        userUploadOptions
      );

      newImage = url;
      newIdImage = public_id;
    }

    // ? Updating values
    for (const key of Object.keys(req.body)) {
      if (key in foundUser && key !== 'password') {
        foundUser[key] = req.body[key];
      }
    }
    if (newImage && newIdImage) {
      foundUser.image = newImage;
      foundUser.id_image = newIdImage;
    }
    await foundUser.save();

    res.status(200).json({ updatedUser: foundUser, message: 'usuario actualizado' });
  } catch (err) {
    throw err;
  } finally {
    if (hasFile) {
      const routeImageDelete = `uploads\\${req.file.filename}`;
      await fs.unlink(routeImageDelete);
    }
  }
};

module.exports = {
  updateUser,
};
