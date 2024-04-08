const fs = require('fs');
const { cloudinary, userUploadOptions } = require('../../config/cloudinaryConfig');
const User = require('../../models/User');

const createUser = async (req, res) => {
  const {
    email,
    firstname,
    lastname,
    password,
    username,
    phone,
    latitud,
    longitud,
    role,
    address
  } = req.body;

  try {
    const hasFile = !!req.file;
    let urlImage = undefined;
    let public_id_prueba = undefined;

    if (hasFile) {
      const newImage = req.file.path;
      const nameImageDelete = req.file.filename;
      const { public_id, url } = await cloudinary.uploader.upload(
        newImage,
        userUploadOptions
      );

      urlImage = url;
      public_id_prueba = public_id;

      const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
      await fs.promises.unlink(routeImageDelete);
    }

    const newData = {
      email,
      firstname,
      lastname,
      password,
      username,
      phone,
      latitud,
      longitud,
      role,
      address,
      image: urlImage,
      id_image: public_id_prueba,
    };

    const user = new User(newData);
    await user.save();
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  createUser
}