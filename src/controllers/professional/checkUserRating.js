const ProfessionalRating = require('#src/models/ProfessionalRating');

const checkUserRating = async (req, res) => {
  const { professional_id, user_id } = req.params;

  const existingRating = await ProfessionalRating.findOne({
    _professional: professional_id,
    _user: user_id,
  });

  res.status(200).json({ hasCommented: !!existingRating });
};

module.exports = { checkUserRating };
