const fs = require('fs');
const { cloudinary, userUploadOptions } = require('../../config/cloudinaryConfig');
const User = require('../../models/User');

const updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    email,
    firstname,
    lastname,
    password,
    username,
    phone,
    latitud,
    longitud,
    id_image,
  } = req.body;

  try {
    const hasFile = !!req.file;
    let newImage = undefined;
    let newIdImage = undefined;

    if (hasFile) {
      const newImageUrl = req.file.path;
      const nameImageDelete = req.file.filename;

      await cloudinary.uploader.destroy(id_image);
      const { public_id, url } = await cloudinary.uploader.upload(
        newImageUrl,
        userUploadOptions
      );
      const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
      await fs.promises.unlink(routeImageDelete);
      newImage = url;
      newIdImage = public_id;
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
      image: newImage,
      id_image: newIdImage,
    };
    await User.findByIdAndUpdate({ _id: id }, newData);
    return res.status(200).json({ message: 'User has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  updateUser
}