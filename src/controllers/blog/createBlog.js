const fs = require('node:fs/promises');
const {
  cloudinary,
  blogsUploadOptions,
} = require('#src/config/cloudinaryConfig');
const { BadRequestError, UnsupportedMediaTypeError } = require('#src/util/errors');
const Blog = require('../../models/Blog');

const createBlog = async (req, res) => {
  const { professional_id, type_id } = req.validatedBody;

  const file = req.file || null;
  if (!file) throw new BadRequestError('No se recibió una imagen para el blog');
  if (!file.mimetype.startsWith('image/')) {
    throw new UnsupportedMediaTypeError('El archivo enviado no es una imagen');
  }

  // ? Sube a cloudinary y retorna el url de la imagen, que luego es asignado al blog
  const { public_id, url } = await cloudinary.uploader.upload(
    file.path,
    blogsUploadOptions
  );
  await fs.unlink(file.path);

  const newData = {
    ...req.validatedBody,
    createdBy: professional_id,
    type: type_id,
    image: url,
    id_image: public_id,
  };
  const blog = new Blog(newData);
  await blog.save();

  res.status(201).json({ blog, message: 'blog creado correctamente' });
};

module.exports = {
  createBlog,
};
