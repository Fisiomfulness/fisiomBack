const { NotFoundError } = require('#src/util/errors');
const { SpecialtyModel } = require('#src/models/profesional/Specialty');
const Question = require('#src/models/Question');

const createQuestion = async (req, res) => {
  const { text, specialtyId } = req.body;

  if (specialtyId) {
    if (!(await SpecialtyModel.findById(specialtyId))) {
      throw new NotFoundError('Especialidad no encontrada');
    }
  }

  const newQuestion = new Question({
    text,
    specialty: specialtyId,
  });
  await newQuestion.save();

  res.status(201).json({ newQuestion });
};

module.exports = {
  createQuestion,
};
