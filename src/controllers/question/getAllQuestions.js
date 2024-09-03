const { BadRequestError } = require('../../util/errors');
const { SpecialtyModel } = require('../../models/profesional/Specialty');
const Question = require('../../models/Question');

const LIMIT_QUESTIONS = 30;

const getAllQuestions = async (req, res) => {
  const {
    offset = 0,
    limit = LIMIT_QUESTIONS,
    specialtyId = null, // ? General question
    search = '',
  } = req.query;

  const offsetInt = parseInt(offset);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(offsetInt) || !Number.isInteger(limitInt)) {
    throw new BadRequestError('"offset" y "limit" deben ser enteros');
  }

  const queryLimit = limitInt <= 0 ? LIMIT_QUESTIONS : Math.min(limitInt, LIMIT_QUESTIONS);
  let query = { specialty: null };

  if (specialtyId) {
    if (!(await SpecialtyModel.findById(specialtyId))) {
      throw new BadRequestError('especialidad no encontrada');
    }
    query.specialty = specialtyId;
  }
  if (search.trim() !== '') {
    query.text = { $regex: new RegExp(search, 'i') };
  }

  const questions = await Question.find(query)
    .sort({ createdDate: 'desc' })
    .skip(offsetInt)
    .limit(queryLimit)
    .populate('answer.professional', 'name image');
  const totalQuestions = await Question.countDocuments(query);
  const hasMoreToLoad = totalQuestions > offsetInt + queryLimit;

  res.status(200).json({ questions, totalQuestions, hasMoreToLoad });
};

module.exports = {
  getAllQuestions,
};
