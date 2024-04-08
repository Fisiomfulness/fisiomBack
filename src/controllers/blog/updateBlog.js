const fs = require('fs');
const { blogsUploadOptions, cloudinary } = require('../../config/cloudinaryConfig');
const Blog = require('../../models/Blog');

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const { text, title, type_id, createBy, id_image } = req.body;
  //console.log({ type_id });
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
        blogsUploadOptions
      );

      const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
      await fs.promises.unlink(routeImageDelete);
      newImage = url;
      newIdImage = public_id;
    }

    const newData = {
      text,
      title,
      // image,
      createBy,
      type_id,
      image: newImage,
      id_image: newIdImage,
    };

    const condition = await Blog.findByIdAndUpdate({ _id: id }, newData);
    if (!condition) throw new Error('blog not found');
    return res.status(200).json({ message: 'Blog has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  updateBlog
}