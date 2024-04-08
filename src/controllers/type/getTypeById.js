const Type = require('../../models/Type');

const getTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const type = await Type.findById(id);
    if (!type) throw new Error('type not found');

    return res.status(200).json({ type });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getTypeById
}
