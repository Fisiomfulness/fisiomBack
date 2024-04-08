const Product = require('../../models/Product');



const getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('category','name')

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  getProductDetail
}