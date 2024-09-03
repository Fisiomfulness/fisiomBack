const Interest = require('#src/models/user/Interest');

const createInterest = async (req, res) => {
  const { name } = req.body;

  const formattedName =
    name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
  const newComment = new Interest({ name: formattedName });
  await newComment.save();

  res.status(201).json({ newComment });
};

module.exports = {
  createInterest,
};
