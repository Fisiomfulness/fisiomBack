const Type = require('../../models/Type');

const getTypes = async (req, res) => {
  const { name = '' } = req.query;
  try {
    let query = {};
    if (name.trim() !== '') query.name = { $regex: new RegExp('^' + name, 'i') };
    const types = await Type.find(query).sort({ name: 1 });
    res.status(200).json({ types });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTypes,
};
