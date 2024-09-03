const { NotFoundError, BadRequestError } = require('#src/util/errors');
const ProfessionalRating =
  require('#src/models/profesional/ProfessionalRating');

const LIMIT_RATINGS = 30;

const getProfessionalRating = async (req, res) => {
  const { professional_id } = req.params;
  const { offset = 0, limit = LIMIT_RATINGS } = req.query;
  const offsetInt = parseInt(offset);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(offsetInt) || !Number.isInteger(limitInt)) {
    throw new BadRequestError('offset and limit must be integers');
  }

  const queryLimit = limitInt <= 0 ? LIMIT_RATINGS : Math.min(limitInt, LIMIT_RATINGS);
  const comments = await ProfessionalRating.find({
    _professional: professional_id,
  })
    .sort({ createdDate: -1 })
    .skip(offsetInt)
    .limit(queryLimit)
    .populate('_user');

  const totalComments = await ProfessionalRating.countDocuments({
    _professional: professional_id,
  });
  const hasMoreToLoad = totalComments > offsetInt + queryLimit;

  res.status(200).json({ comments, totalComments, hasMoreToLoad });
};

module.exports = { getProfessionalRating };
