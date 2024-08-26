const Interest = require('#src/models/user/Interest');

const deleteInterest = async (req, res) => {
  const { id } = req.params;

  const deleted = await Interest.findByIdAndDelete(id);
  if (!deleted) throw new NotFoundError('interés no encontrado');

  res.status(200).json({ deleted });
};

module.exports = {
  deleteInterest,
};
