const fs = require('node:fs/promises');
const {
  blogsUploadOptions,
  cloudinary,
} = require('../../config/cloudinaryConfig');
const {
  NotFoundError,
  BadRequestError,
  UnsupportedMediaTypeError,
} = require('../../util/errors');
const Blog = require('../../models/blog/Blog');

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const { text, title, image, type_id, id_image } = req.body;

  const hasFile = !!req.file;
  let newImage = undefined;
  let newIdImage = undefined;

  if (hasFile) {
    const newImageUrl = req.file.path;
    const nameImageDelete = req.file.filename;

    // * Solo se modificara la imagen si el archivo es una imagen
    if (req.file.mimetype.startsWith('image/')) {
      await cloudinary.uploader.destroy(id_image);
      const { public_id, url } = await cloudinary.uploader.upload(
        newImageUrl,
        blogsUploadOptions,
      );
      newImage = url;
      newIdImage = public_id;
    }

    const routeImageDelete = `uploads\\${nameImageDelete}`;
    await fs.unlink(routeImageDelete);
  }

  const newData = {
    ...req.validatedBody,
    type: type_id,
    image: newImage,
    id_image: newIdImage,
  };
  const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, newData, {
    new: true,
  });
  if (!updatedBlog) throw new NotFoundError('blog no encontrado');

  res
    .status(200)
    .json({ updatedBlog, message: 'blog actualizado correctamente' });
};

module.exports = {
  updateBlog,
};
