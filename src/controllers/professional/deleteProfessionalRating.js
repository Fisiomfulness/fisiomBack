const { NotFoundError } = require('#src/util/errors');
const { updateProfessionalRating } = require('#src/services/professionalService');
const ProfessionalRating = require('../../models/ProfessionalRating');

const deleteProfessionalRating = async (req, res) => {
  const { id } = req.params;

  const rating = await ProfessionalRating.findByIdAndDelete(id);
  if (!rating) throw new NotFoundError('Comentario no encontrado');

  await updateProfessionalRating(rating._professional, -rating.score, -1);

  res.status(201).json({ message: 'Comentario eliminado correctamente' });
};

module.exports = { deleteProfessionalRating };
