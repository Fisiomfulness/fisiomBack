const fs = require('node:fs/promises');
const {
  blogsUploadOptions,
  cloudinary,
} = require('../../config/cloudinaryConfig');
const Blog = require('../../models/Blog');

const createBlog = async (req, res) => {
  const { title, text, image, user_id, type_id } = req.body;

  try {
    // const newImage = req.file.path;
    // const nameImageDelete = req.file.filename;
    // const { public_id, url } = await cloudinary.uploader.upload(
    //   newImage,
    //   blogsUploadOptions
    // );
    const newBlog = {
      text,
      title,
      createdBy: user_id,
      type: type_id,
      image,
      // id_image: public_id,
    };
    // const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
    // await fs.unlink(routeImageDelete);
    const blog = new Blog(newBlog);
    await blog.save();
    res.status(200).json({ blog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
};
