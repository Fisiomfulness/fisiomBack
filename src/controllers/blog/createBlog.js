const fs = require('fs');
const { blogsUploadOptions, cloudinary } = require('../../config/cloudinaryConfig');
const Blog = require('../../models/Blog');

const createBlog = async (req, res) => {
  const { text, title, type_id, createBy } = req.body;

  try {
    const newImage = req.file.path;
    const nameImageDelete = req.file.filename;
    const { public_id, url } = await cloudinary.uploader.upload(
      newImage,
      blogsUploadOptions
    );
    const newBlog = {
      text,
      title,
      type_id,
      createBy,
      image: url,
      id_image: public_id,
    };
    const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
    await fs.promises.unlink(routeImageDelete);
    const blog = new Blog(newBlog);
    await blog.save();
    return res.status(200).json({ blog });
  } catch (error) {
    //console.log(error);
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  createBlog
}