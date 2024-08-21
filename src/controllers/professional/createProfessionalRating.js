const { BadRequestError } = require('#src/util/errors');
const {
  updateProfessionalRating,
} = require('#src/services/professionalService');
const Professional = require('#src/models/profesional/Profesional');
const ProfessionalRating =
  require('../../models/profesional/ProfessionalRating');

const createProfessionalRating = async (req, res) => {
  const { _user, _professional, score, description } = req.validatedBody;

  const existingRating = await ProfessionalRating.findOne({
    _user,
    _professional,
  });
  if (existingRating) {
    throw new BadRequestError(
      'Ya le has dejado un comentario a este profesional',
    );
  }

  const newRating = new ProfessionalRating(req.validatedBody);
  await newRating.save();
  await newRating.populate('_user', 'image name');

  await updateProfessionalRating(_professional, score, 1);

  res.status(201).json({ newRating });
};

module.exports = { createProfessionalRating };
