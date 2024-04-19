const Product = require('../../models/Product');



const getAllProduct = async (req, res) => {
  try {
    const { title } = req.query;

    const query = { status: true };
    if (title) {
      query.title = title;
    };
    const products = await Product.find(query).populate(
      'category',
      'name'
    );
    

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getAllProduct
}