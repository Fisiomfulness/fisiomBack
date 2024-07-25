const Product = require('../../models/product/Product');

const getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', categoryId = '' } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
      return res
        .status(400)
        .json({ message: 'page and limit must be integers' });
    }

    const skipIndex = (pageInt - 1) * limitInt;
    const query = { status: true };

    if (search.trim() !== '') {
      query.name = { $regex: new RegExp(search, 'i') };
    }

    if (categoryId.trim() !== '') {
      query.category = categoryId;
    }

    const products = await Product.find(query)
      .skip(skipIndex)
      .limit(limitInt)
      .populate({
        path: 'category',
        select: 'name',
      });

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitInt);
    return res.status(200).json({ products, page: pageInt, totalPages });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllProduct,
};
