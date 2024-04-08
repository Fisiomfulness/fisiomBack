const fs = require('fs');
const Product = require('../../models/Product');
const {
  cloudinary,
  productsUploadOptions,
} = require('../../config/cloudinaryConfig.js');

const createProduct = async (req, res) => {
  const { name, price, stock, category, description } = req.body;
  try {
    const newImage = req.file.path;
    const nameImageDelete = req.file.filename;
    const { public_id, url } = await cloudinary.uploader.upload(
      newImage,
      productsUploadOptions
    );
    const newProduct = {
      name,
      price,
      stock,
      category,
      description,
      image: url,
      id_image: public_id,
    };

    const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
    await fs.promises.unlink(routeImageDelete);

    const product = new Product(newProduct);
    await product.save();

    return res.status(200).json({ message: 'Create Product', product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  createProduct
}