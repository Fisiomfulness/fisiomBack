const Type = require('../../models/Type');

const createType = async (req, res) => {
  const { name } = req.body;
  try {
    const type = new Type({ name });
    await type.save();
    return res.status(200).json({ type });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  createType
}