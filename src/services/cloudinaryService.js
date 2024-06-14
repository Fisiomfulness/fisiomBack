const {
  cloudinary,
} = require('#src/config/cloudinaryConfig');
const fs = require('node:fs/promises');

const uploadImage = async (file, uploadOptions = {}, existingImageId) => {
  const newImageUrl = file.path;

  if (existingImageId) await cloudinary.uploader.destroy(existingImageId);

  const { public_id, url } = await cloudinary.uploader.upload(
    newImageUrl,
    uploadOptions
  );
  return { public_id, url };
};

const deleteLocalFile = async (filename) => {
  const filePath = `uploads\\${filename}`;
  await fs.unlink(filePath);
};

module.exports = {
  uploadImage,
  deleteLocalFile,
};
