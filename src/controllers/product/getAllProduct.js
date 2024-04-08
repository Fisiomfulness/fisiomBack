const Product = require('../../models/Product');



const getAllProduct = async (req, res) => {
  const { title } = req.query;
  try {
    const products = await Product.find({ status: true }).populate(
      'category',
      'name'
    );

    if (!title) return res.status(200).json({ products });

    const productFilter = products.filter((product) =>
      product.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!productFilter.length) throw new Error('no product found');

    return res.status(200).json({ productFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getAllProduct
}