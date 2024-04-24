const { NotFoundError, BadRequestError } = require('../../util/errors');
const { blogSchema } = require('../../util/validationSchemas');
const Blog = require('../../models/Blog');

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const { text, title, image, type_id } = req.validatedBody;

  const newData = { ...req.validatedBody, type: type_id };
  const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, newData, { new: true });
  if (!updatedBlog) throw new NotFoundError('blog not found');

  res.status(200).json({ updatedBlog, message: 'blog has been updated' });
};

// const {
//   blogsUploadOptions,
//   cloudinary,
// } = require('../../config/cloudinaryConfig');
// const fs = require('node:fs/promises');

// const hasFile = !!req.file;
// let newImage = undefined;
// let newIdImage = undefined;

// if (hasFile) {
//   const newImageUrl = req.file.path;
//   const nameImageDelete = req.file.filename;

//   await cloudinary.uploader.destroy(id_image);
//   const { public_id, url } = await cloudinary.uploader.upload(
//     newImageUrl,
//     blogsUploadOptions
//   );

//   const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
//   await fs.unlink(routeImageDelete);
//   newImage = url;
//   newIdImage = public_id;
// }

module.exports = {
  updateBlog,
};
