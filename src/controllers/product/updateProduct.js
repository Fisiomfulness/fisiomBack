const fs = require('fs');
const Product = require('../../models/Product');
const {
  cloudinary,
  productsUploadOptions,
} = require('../../config/cloudinaryConfig.js');


const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price, stock, category, description, id_image } = req.body;
  try {
    const hasFile = !!req.file;
    let newImage = undefined;
    let newIdImage = undefined;

    if (hasFile) {
      const newImageUrl = req.file.path;
      const nameImageDelete = req.file.filename;
      await cloudinary.uploader.destroy(id_image);

      const { public_id, url } = await cloudinary.uploader.upload(newImageUrl, {
        ...productsUploadOptions,
      });
      const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
      await fs.promises.unlink(routeImageDelete);
      newImage = url;
      newIdImage = public_id;
    }

    const newData = {
      name,
      price,
      stock,
      category,
      description,
      image: newImage,
      id_image: newIdImage,
    };

    const condition = await Product.findByIdAndUpdate({ _id: id }, newData);
    if (!condition) throw new Error('product not found');

    return res.status(200).json({ message: 'Product has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  updateProduct
}
