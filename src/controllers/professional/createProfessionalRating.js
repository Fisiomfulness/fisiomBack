const { BadRequestError } = require('#src/util/errors');
const Professional = require('#src/models/Profesional');
const ProfessionalRating = require('../../models/ProfessionalRating');

const createProfessionalRating = async (req, res) => {
  const { _user, _professional, score, description } = req.validatedBody;

  const existingRating = await ProfessionalRating.findOne({ _user, _professional });
  if (existingRating) {
    throw new BadRequestError('Ya le has dejado un comentario a este profesional');
  }

  const professional = await Professional.findById(_professional);

  const total = professional.rating.total + score;
  const totalComments = professional.rating.totalComments + 1;
  const updatedRating = {
    total,
    totalComments,
    average: Math.round(total / totalComments),
  };

  await Professional.findByIdAndUpdate(_professional, {
    rating: updatedRating,
  });

  const newRating = new ProfessionalRating({
    _user,
    _professional,
    description,
    score,
  });
  await newRating.save();
  await newRating.populate('_user', 'image name');

  res.status(201).json({ newRating });
};

module.exports = { createProfessionalRating };
