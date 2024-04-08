const Product = require('../../models/Product');
const {
  cloudinary,
} = require('../../config/cloudinaryConfig.js');


const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('the product does not exist');
    await cloudinary.uploader.destroy(product.id_image);

    return res
      .status(200)
      .json({ message: `the product with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  deleteProduct
}