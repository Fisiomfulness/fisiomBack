const ProfessionalRating =
  require('#src/models/profesional/ProfessionalRating');

// * Lo llamamos Account por que cualquier cuenta puede dejar un comentario en el perfil Profesional
const checkUserRating = async (req, res) => {
  const { professional_id, user_id } = req.params;

  const existingRating = await ProfessionalRating.findOne({
    _professional: professional_id,
    _user: user_id,
  });

  res.status(200).json({ hasCommented: !!existingRating });
};

module.exports = { checkUserRating };
