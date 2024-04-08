const Product = require('../../models/Product');



const statusProduct = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('the product does not exist');

    product.status = status;
    await product.save();

    return res
      .status(200)
      .json({ message: `the product with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  statusProduct
}