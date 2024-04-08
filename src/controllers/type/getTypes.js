const Type = require('../../models/Type');


const getTypes = async (req, res) => {
  const { name } = req.query;
  try {
    const types = await Type.find({});

    if (!name) return res.status(200).json({ types });

    const typeFilter = types.filter((type) =>
      type.name.toLowerCase().includes(name.toLowerCase())
    );
    if (!typeFilter.length) throw new Error('no type found with that name');

    return res.status(200).json({ typeFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getTypes
}