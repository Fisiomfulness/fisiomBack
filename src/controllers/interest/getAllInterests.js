const Interest = require('#src/models/Interest');

const getAllInterests = async (req, res) => {
  const { name = '' } = req.query;

  let query = {};

  if (name.trim() !== '') query.name = { $regex: new RegExp(name, 'i') };

  const interests = await Interest.find(query).sort({ name: 1 });

  res.status(200).json({ interests });
};

module.exports = {
  getAllInterests,
};
