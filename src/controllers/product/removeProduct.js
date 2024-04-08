const Product = require('../../models/Product');

const removeProduct = async (req, res) => {
  try {
    const productsRemoved = await Product.find({ status: false }).populate('category','name');

    return res.status(200).json({ productsRemoved });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}


module.exports = {
  removeProduct
}